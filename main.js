let Picker = {}
Picker.numberOfEmphasizedDigits = 4

// World population counter
let timestamp1 = 1678265517712
let pop1 = 8020716316
let timestamp2 = 1680008052793
let pop2 = 8024412581
let speed = (pop2 - pop1) / (timestamp2 - timestamp1)

let getPopValue = () => {
    return Math.round(pop1 + (new Date().getTime() - timestamp1) * speed)
}

Picker.spreadNumberString = (nb) => {
    let noed = Picker.numberOfEmphasizedDigits
    let spread = nb.substr(0, 1) + " " + nb.substr(1, 3) + " " + nb.substr(4, 3) + " " + nb.substr(7, 3)
    let len = spread.length

    if (noed == 2) result = spread.substr(0, len - 2) + "<span>" + spread.substr(len - 2, 2)
    else if (noed == 3) result = spread.substr(0, len - 3) + "<span>" + spread.substr(len - 3, 3)
    else if (noed == 4) result = spread.substr(0, len - 5) + "<span>" + spread.substr(len - 5, 5)

    result += "</span>"

    return result
}
let node = document.querySelector('p#pop-counter')
let interval = setInterval(() => {
    let popValue = getPopValue()
    let popString = popValue.toString()
    let pop = Picker.spreadNumberString(popString)
    node.innerHTML = pop
}, 200)

// Second interval for glitches due to people dying as well
// 470ms because in 51180 seconds, 108893 people had died on May 2nd 2023 14:13 UTC+2
let interval2 = setInterval(() => {
    let popValue = getPopValue()
    let popString = popValue.toString()
    node.innerHTML = Picker.spreadNumberString(popString)
}, 940)

// Capture display
Picker.next = 1
Picker.sliderVisible = false
Picker.captured = true
let processingNode = document.querySelector('#processing')
let worldPopNode = document.querySelector('#world-pop')
Picker.captureNext = () => {
    let noed = Picker.numberOfEmphasizedDigits
    Picker.next = Number(getPopValue().toString().substr(10 - noed, noed))
    processingNode.innerHTML = Picker.next
}

// Update capturable figure (just front refresh)
let interval3 = setInterval(() => {
    if (Picker.captured) return false
    else {
        let noed = Picker.numberOfEmphasizedDigits
        processingNode.innerHTML = Number(getPopValue().toString().substr(10 - noed, noed))
    }
}, 200)

