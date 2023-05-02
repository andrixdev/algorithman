let voices
let synth

// World population counter
var timestamp1 = 1678265517712
var pop1 = 8020716316
var timestamp2 = 1680008052793
var pop2 = 8024412581
var speed = (pop2 - pop1) / (timestamp2 - timestamp1)

var getPopValue = () => { return Math.round(pop1 + (new Date().getTime() - timestamp1) * speed) }
let spreadNumberString = (nb) => {
    return nb.substr(0, 1) + " " + nb.substr(1, 3) + " " + nb.substr(4, 3) + " " + nb.substr(7, 3)
}
var node = document.querySelector('p#pop-counter')
var interval = setInterval(() => {
    var popValue = getPopValue()
    var popString = popValue.toString()
    var pop = spreadNumberString(popString)
    node.innerHTML = pop
}, 600)

// Second interval for glitches due to people dying as well
// 470ms because in 51180 seconds, 108893 people had died on May 2nd 2023 14:13 UTC+2
var interval2 = setInterval(() => {
    var pop = Number(node.innerHTML.replaceAll(" ", "")) - 1
    node.innerHTML = spreadNumberString(pop.toString())
    /*setTimeout(() => {
        node.innerHTML = spreadNumberString(getPopValue().toString())
    }, 200)*/
}, 940)

// Capture display
let modulo = 500
let capture = 0
let moduloNode = document.querySelector('#modulo span')
let resultNode = document.querySelector('#result')
let inputNode = document.querySelector('input#modulo-range')
let frozen = false

// Update modulo counter unless it's being captured (frozen)
let interval3 = setInterval(() => {
    if (frozen) return false
    capture = 1 + (getPopValue() - 1) % modulo
    resultNode.innerHTML = capture
}, 100)

// Listeners
document.addEventListener("DOMContentLoaded", (ev) => {

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
        console.log(event.results)
        //const color = event.results[0][0].transcript
        //const confidence = event.results[0][0].confidence
    }
    recognition.onspeechend = () => {
        recognition.stop()
    }
    recognition.onnomatch = () => {
        diagnostic.textContent = "I didn't recognize that color."
    }
    recognition.onerror = (event) => {
        diagnostic.textContent = `Error occurred in recognition: ${event.error}`
    }

    // Input slider
    inputNode.addEventListener("input", (event) => {
        modulo = event.target.value
        moduloNode.innerHTML = "modulo " + modulo
    })

    // Capture key
    document.addEventListener("keydown", (event) => {
        if (event.keyCode == 65) { // 'a'
            // Text-to-speech
            //This is correct. Now, human, make sense of 124
            //This is incorrect. Human, please, make sense of 234

            frozen = true

            // Init speech synthesis (text-to-speech)
            synth = window.speechSynthesis
            voices = synth.getVoices()
            let v = []
            voices.forEach((el) => v.push(el))
            let enVoice = voices.filter((el) => { return el.lang == "en-GB" })[0]

            let textForUtterance = enVoice.name + " (" + enVoice.lang + ")"
            let message = "Now, human, please make sense of, " + capture
            const utterThis = new SpeechSynthesisUtterance(message)
            utterThis.voice = enVoice; utterThis.pitch = .05; utterThis.rate = .8
            utterThis.onend = (event) => { frozen = false }

            synth.speak(utterThis)
        }
    })
})


