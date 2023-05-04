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
let Picker = {}
Picker.modulo = 500
Picker.capture = 0
Picker.captured = false
let moduloNode = document.querySelector('#modulo span')
let resultNode = document.querySelector('#result')
let inputNode = document.querySelector('input#modulo-range')

// Update modulo counter unless it's being captured
let interval3 = setInterval(() => {
    if (Picker.captured) return false
    else {
        Picker.capture = 1 + (getPopValue() - 1) % Picker.modulo
        resultNode.innerHTML = Picker.capture
    }
}, 100)

// Input slider
inputNode.addEventListener("input", (event) => {
    Picker.modulo = event.target.value
    moduloNode.innerHTML = "modulo " + Picker.modulo
})