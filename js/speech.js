let Speech = {}
Speech.frozen = false
Speech.pauseComputing = false
let voices
let synth
let rawSpeechNode = document.querySelector('p#raw-speech')
let parsedSpeechNode = document.querySelector('p#parsed-speech')
let speechArray = []
let speechArrayIndex = 0 // Due to documented API bug, we have to store all transcripts separately in an array
let fullSpeech = ""
let latestSpeech = ""
let parsedSpeech = ""

// Speech parser
let parseMap = [
    ["one", "1"], ["two", "2"], ["to", "2"], ["three", "3"], ["four", "4"], ["for", "4"], ["five", "5"], ["six", "6"], ["seven", "7"], ["eight", "8"], ["nine", "9"], ["zero", "0"], ["oh", "0"],
    ["times", "x"], ["*", "x"],
    ["is", "="], ["equals", "="], ["equal", "="],
    ["Prime", "prime"], ["primed", "prime"]
]
let currentOperation = []
let numberToGuess
let currentGuess
let okCount = 0
let lastOKCount = 0
let guessingIsInit = false

let computeSpeech = (callback) => {
    if (Speech.pauseComputing) return false
    let last = fullSpeech.toLowerCase().split('ok')
    okCount = last.length

    // Maybe start new guessing!
    if (okCount !== lastOKCount) {
        numberToGuess = undefined
        resetGuessing()
        guessingIsInit = false
        lastOKCount == okCount
    }

    // Get bit of speech after last 'ok'
    let lastSpeech = last[last.length - 1]

    // Get bit of speech before last 'check'
    let check = lastSpeech.toLowerCase().split('check') // Last element should be empty string [..., '']
    //log('check: ', check)
    let toCheck = ""
    let checkAsked = false
    if (check.length == 1) { toCheck = check[0] }
    else if (check[check.length - 1] == '') {
        checkAsked = true
        toCheck = check[check.length - 2]
    } else {
        toCheck = check[check.length - 1]
    }

    // Translate into math with parseMap
    parseMap.forEach((transform) => {
        toCheck = toCheck.replaceAll(transform[0], transform[1])
    })

    // Remove spaces between numbers if no operator
    let arr = toCheck.split(' ')
	
	
	log('arr:', arr)
	
	// Filter content
    indexesOfElementsToRemove = []
    arr.forEach((bit, i) => {
        arr[i] = arr[i].replaceAll(',', '')
        arr[i] = arr[i].replaceAll('.', '')
		
        if (bit == ' ') {
            if (i > 0 && i < (arr.length - 1) && Number.isInteger(Number(arr[i-1])) && Number.isInteger(Number(arr[i+1]))) {
                indexesOfElementsToRemove.push(i)
            }
        } else if (bit != 'x' && bit != '=' && bit != 'prime' && !Number.isInteger(Number(bit))) {
            indexesOfElementsToRemove.push(i)
        }
    })
    
    let cleanArr = arr.filter((el, i) => {
        let isToRemove = false
        indexesOfElementsToRemove.forEach((indexxx) => {
            if (i == indexxx) isToRemove = true
        })
        return !isToRemove
    })
	
	log('cleanArr: ', cleanArr)

    // Create operation chain
    let leftRight = cleanArr.join('').split('=')
    let left = leftRight[0]
    numberToGuess = Number(left)
    parsedSpeech = left // Visual output
    if (leftRight.length == 1) { }
    if (leftRight.length == 2) {// '=' has been detected
        if (!guessingIsInit) {
            initGuessing(numberToGuess)
            guessingIsInit = true
        }
        let right = leftRight[1]
        currentGuess = right
		
		// If prime, copy left term of equation (number to guess)
		if (currentGuess.includes('prime')) currentGuess = left
		
        // Extract only numbers for prime validation (no 'x' or '')
        let factors = currentGuess.split('x')
        factors = factors.filter(el => {
            return el != '' && Number.isInteger(Number(el))
        })
		
		// Display factors in right term of equation with 'x' characters
        parsedSpeech += ' = ' + factors.join(' x ')

        // Wait until detection of 'check' to compute the operation
        if (checkAsked) {
            factors.forEach((p) => {
                handleNewPrime(Number(p))
            })
        }
    }
    
    callback()
}

// Init speech recognition
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent
const grammar =
"#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;"
const recognition = new SpeechRecognition()
const speechRecognitionList = new SpeechGrammarList()
speechRecognitionList.addFromString(grammar, 1)
recognition.grammars = speechRecognitionList
recognition.continuous = true
recognition.lang = "en-US"
recognition.interimResults = true
recognition.maxAlternatives = 1

recognition.onresult = (event) => {
    latestSpeech = ""
    Array.from(event.results).forEach((result) => {
        latestSpeech = latestSpeech.concat(result[0].transcript)
    })
    speechArray[speechArrayIndex] = latestSpeech
    fullSpeech = speechArray.join(' ')

    let callback = () => {
        rawSpeechNode.innerHTML = fullSpeech
        parsedSpeechNode.innerHTML = parsedSpeech
    }

    computeSpeech(callback)
}
recognition.onspeechend = () => {
    //recognition.stop()
}
recognition.onnomatch = () => {
    //diagnostic.textContent = "I didn't recognize that color."
}
recognition.onerror = (event) => {
	let msg = `Error occurred in recognition: ${event.error}. Restarting.`
    console.log(msg)
    recognition.start()
	//setTimeout(() => { Speech.say(msg) }, 5000)
}

// Fix erratic stop https://stackoverflow.com/questions/34818154/webkitspeechrecognition-stops-recording-randomly
let forceWork = setInterval(() => {
    recognition.stop()
}, 30000)
recognition.onend = (event) => {
    console.log('Forced periodic onend -> restarting')
    recognition.start()
    // Extend speechArray
    speechArray.push("")
    speechArrayIndex++
}

Speech.say = (message) => {
    
    if (!Main.activateTextToSpeech) return false
    if (Speech.frozen) return false // Avoids stacking of instructions

    //Speech.frozen = true

    // Init speech synthesis (text-to-speech)
    synth = window.speechSynthesis
    voices = synth.getVoices()
    let v = []
    voices.forEach((el) => v.push(el))
    //let enVoice = voices.filter((el) => { return el.name == "Google UK English Female" })[0]
    //let enVoice = voices.filter((el) => { return el.name == "Microsoft David" })[0]
    let enVoice = voices.filter((el) => { return el.name == "Google UK English Male" })[0]
    console.log(voices)

    //let textForUtterance = enVoice.name + " (" + enVoice.lang + ")"
    const utterThis = new SpeechSynthesisUtterance(message)
    utterThis.voice = enVoice; utterThis.pitch = .31; utterThis.rate = 1
    utterThis.onend = (event) => {
        Speech.frozen = false
    }
    synth.speak(utterThis)  
}
Speech.makeSenseOf = () => {
    Speech.say("Now, human, please make sense of, " + Picker.next)
}
Speech.correct = () => {
    Speech.say('Correct. Thank you...')
}
Speech.incorrect = () => {
    Speech.say("Incorrect. Human, please, make sense of, " + Picker.next)
}
