let Main = {}
Main.activateSpeechRecognition = false
Main.activateTextToSpeech = true
Main.activateOwnVoiceEcho = true // used only if speech recognition is active
Main.activateKeyboardControl = true
Main.numberOfEmphasizedDigits = 3

// World population counter
let timestamp1 = 1678265517712
let pop1 = 8020716316
let timestamp2 = 1680008052793
let pop2 = 8024412581
let diff = pop2 - pop1
let proportionOfDead = 25268711 / 50461412
let speed = (pop2 - pop1) / (timestamp2 - timestamp1)
let deathSpeed = speed * proportionOfDead
let bornSpeed = speed * (1 + proportionOfDead)

let getPopValue = () => {
    let dead = Math.round((new Date().getTime() - timestamp1) * deathSpeed)
    let born = Math.round((new Date().getTime() - timestamp1) * bornSpeed)
    return Math.round(pop1 + born - dead)
}

let Picker = {}
Picker.spreadNumberString = (nb) => {
    let noed = Main.numberOfEmphasizedDigits
    let spread = nb.substr(0, 1) + " " + nb.substr(1, 3) + " " + nb.substr(4, 3) + " " + nb.substr(7, 3)
    let len = spread.length

    if (noed == 2) result = spread.substr(0, len - 2) + "<span>" + spread.substr(len - 2, 2)
    else if (noed == 3) result = spread.substr(0, len - 3) + "<span>" + spread.substr(len - 3, 3)
    else if (noed == 4) result = spread.substr(0, len - 5) + "<span>" + spread.substr(len - 5, 5)

    result += "</span>"

    return result
}
let popNode = document.querySelector('p#pop-counter')
let interval = setInterval(() => {
    let popValue = getPopValue()
    let popString = popValue.toString()
    let pop = Picker.spreadNumberString(popString)
    popNode.innerHTML = pop
}, 200)

// Second interval for glitches due to people dying as well
// 470ms because in 51180 seconds, 108893 people had died on May 2nd 2023 14:13 UTC+2
let interval2 = setInterval(() => {
    let popValue = getPopValue()
    let popString = popValue.toString()
    popNode.innerHTML = Picker.spreadNumberString(popString)
}, 940)

// Capture display
Picker.next = 1
Picker.sliderVisible = false
Picker.captured = false
let processingNode = document.querySelector('#processing')
let worldPopNode = document.querySelector('#world-pop')
let nowMessageNode = document.querySelector('#now')
Picker.capture = () => {
    Picker.captured = true
    let noed = Main.numberOfEmphasizedDigits
    Picker.next = Number(getPopValue().toString().substr(10 - noed, noed))
    processingNode.innerHTML = Picker.next
    nowMessageNode.classList = ''
}
Picker.release = () => {
    Picker.captured = false
    nowMessageNode.classList = 'hidden'
}

// Update capturable figure (just front refresh)
let interval3 = setInterval(() => {
    if (Picker.captured) return false
    else {
        let noed = Main.numberOfEmphasizedDigits
        processingNode.innerHTML = Number(getPopValue().toString().substr(10 - noed, noed))
    }
}, 200)

