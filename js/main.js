let Main = {}
Main.activateSpeechRecognition = true
Main.activateTextToSpeech = true
Main.activateOwnVoiceEcho = false // used only if speech recognition is active
Main.activateKeyboardControl = true
Main.numberOfEmphasizedDigits = 3
Main.theme = undefined

Main.updateTheme = (newThemeName) => {
    Main.theme = newThemeName
    let htmlNode = document.getElementsByTagName('html')[0]
    htmlNode.classList = Main.theme
}
Main.clickToStart = () => {
    let cts = document.getElementById('click-to-start')
    cts.addEventListener('click', (e) => {
        // Hide view
        cts.classList.toggle('hidden', true)

        // Start speech recognition
        if (Main.activateSpeechRecognition) {
            recognition.start()
            console.log("Speech recognition started.")
        }
    })
}

// World population counter
let timestamp1 = 1736615105396
let pop1 = 8199323230
let timestamp2 = 1737395930913
let pop2 = 8201056820
let diff = pop2 - pop1
let proportionOfDead = 1838600 / 3901912
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


document.addEventListener("DOMContentLoaded", () => {
    Main.updateTheme('dark-theme')
    Main.clickToStart()
})
