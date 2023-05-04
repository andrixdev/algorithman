// World population counter
var timestamp1 = 1678265517712
var pop1 = 8020716316
var timestamp2 = 1680008052793
var pop2 = 8024412581
var speed = (pop2 - pop1) / (timestamp2 - timestamp1)

var getPopValue = () => { return Math.round(pop1 + (new Date().getTime() - timestamp1) * speed) }
let spreadNumberString = (nb) => {
    return nb.substr(0, 1) + " " + nb.substr(1, 3) + " " + nb.substr(4, 3) + " <span>" + nb.substr(7, 3) + "</span>"
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
    var popValue = getPopValue()
    var popString = popValue.toString()
    node.innerHTML = spreadNumberString(popString)
}, 940)

// Capture display
let Picker = {}
Picker.modulo = 500
Picker.next = 563
Picker.sliderVisible = false
Picker.captured = true
let moduloNode = document.querySelector('#modulo span')
let processingNode = document.querySelector('#processing')
let inputNode = document.querySelector('input#modulo-range')
let worldPopNode = document.querySelector('#world-pop')
let sliderNumberNode = document.querySelector('#slider-number')

// Update capturable figure
let interval3 = setInterval(() => {
    if (Picker.captured) return false
    else {
        Picker.next = "43" + getPopValue().toString().substr(8, 2) //1 + (getPopValue() - 1) % Picker.modulo
        processingNode.innerHTML = Picker.next
    }
}, 100)

// Input slider
inputNode.addEventListener("input", (event) => {
    // Show slider if not already visible
    if (!Picker.sliderVisible) {
        Picker.sliderVisible = true
        Picker.showSlider()
    }
    Picker.next = event.target.value
    sliderNumberNode.innerHTML = Picker.next
})
Picker.showSlider = () => {
    worldPopNode.classList = "hidden"
    setTimeout(() => {
        sliderNumberNode.classList = ""
    }, 1000)
    
}
