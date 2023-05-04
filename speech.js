let Speech = {}
Speech.frozen = false
let voices
let synth
let rawSpeechNode = document.querySelector('p#raw-speech')
let parsedSpeechNode = document.querySelector('p#parsed-speech')
let rawSpeech = ""
let parsedSpeech = ""

// Speech parser
let parseMap = [
    ["one", "1"], ["two", "2"], ["to", "2"], ["three", "3"], ["four", "4"], ["for", "4"], ["five", "5"], ["six", "6"], ["seven", "7"], ["eight", "8"], ["nine", "9"], ["zero", "0"], ["oh", "0"],
    ["times", "x"],
    ["is", "="], ["equals", "="],
    ["Prime", "prime"]
]
let currentOperation = []
let numberToGuess
let currentGuess
let resetCount = 0
let lastResetCount = 0
let guessingIsInit = false

let computeSpeech = (callback) => {
    let last = rawSpeech.split('reset')
    resetCount = last.length
    let checkAsked = false

    // Maybe start new guessing!
    if (resetCount !== lastResetCount) {
        numberToGuess = undefined
        resetGuessing()
        guessingIsInit = false
        lastResetCount == resetCount
    }

    // Get bit of speech after last 'reset'
    lastSpeech = last[last.length - 1]

    // Get bit of speech before last 'check'
    let check = lastSpeech.toLowerCase().split('check') // Last element should be empty string [..., '']
    let toCheck = ""
    console.log(check)
    if (check.length < 2) return false
    if (check[check.length - 1] == '') {
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
    indexesOfElementsToRemove = []
    arr.forEach((bit, i) => {
        arr[i] = arr[i].replaceAll(',', '')
        arr[i] = arr[i].replaceAll('.', '')
        if (bit == ' ') {
            if (i > 0 && i < (arr.length - 1) && Number.isInteger(Number(arr[i-1])) && Number.isInteger(Number(arr[i+1]))) {
                indexesOfElementsToRemove.push(i)
            }
        } else if (bit != 'x' && bit != '=' && !Number.isInteger(Number(bit))) {
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

    // Create operation chain
    let leftRight = cleanArr.join('').split('=')
    let left = leftRight[0]
    numberToGuess = Number(left)
    parsedSpeech = left // Visual output
    if (leftRight.length == 2) {// '=' has been detected
        if (!guessingIsInit) {
            initGuessing(numberToGuess)
            guessingIsInit = true
        }
        let right = leftRight[1]
        currentGuess = right
        let factors = currentGuess.split('x')
        // Extract only numbers (no 'x' or '')
        factors = factors.filter(el => {
            return el != '' && Number.isInteger(Number(el))
        })
        parsedSpeech += ' = ' + factors.join(' x ')

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

document.body.onclick = () => {
    recognition.start()
    console.log("Ready to receive a color command.")
}
recognition.onresult = (event) => {
    rawSpeech = ""
    Array.from(event.results).forEach((result) => {
        rawSpeech = rawSpeech.concat(result[0].transcript)
    })

    let callback = () => {
        rawSpeechNode.innerHTML = rawSpeech
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
    console.log(`Error occurred in recognition: ${event.error}`)
}

Speech.say = (message) => {
    if (Speech.frozen) return false // Avoids stacking of instructions

    Speech.frozen = true

    // Init speech synthesis (text-to-speech)
    synth = window.speechSynthesis
    voices = synth.getVoices()
    let v = []
    voices.forEach((el) => v.push(el))
    //let enVoice = voices.filter((el) => { return el.name == "Google UK English Female" })[0]
    //let enVoice = voices.filter((el) => { return el.name == "Google US English" })[0]
    let enVoice = voices.filter((el) => { return el.name == "Google UK English Male" })[0]
    console.log(voices)

    //let textForUtterance = enVoice.name + " (" + enVoice.lang + ")"
    const utterThis = new SpeechSynthesisUtterance(message)
    utterThis.voice = enVoice; utterThis.pitch = 1; utterThis.rate = 1
    utterThis.onend = (event) => {
        Speech.frozen = false
    }
    synth.speak(utterThis)  
}
Speech.makeSenseOf = () => {
    Speech.say("This is correct. Thank you. . . . Now, human, please make sense of, " + capture)
}
Speech.incorrect = () => {
    Speech.say("This is incorrect. Human, please, make sense of, " + capture)
}