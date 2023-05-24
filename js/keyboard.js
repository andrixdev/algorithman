document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keyup", (event) => {
        if (Main.activateKeyboardControl) {
            // Space bar -> capture number
            if (event.keyCode == 32) {
                if (Picker.captured) Picker.release()
                else Picker.capture()
            }
            // Up & down arrows -> increase or decrease Main.numberOfEmphasizedDigits
            else if (event.keyCode == 38) { // increase
                Main.numberOfEmphasizedDigits = Math.min(4, Main.numberOfEmphasizedDigits + 1)
            } else if (event.keyCode == 40) {
                Main.numberOfEmphasizedDigits = Math.max(2, Main.numberOfEmphasizedDigits - 1)
            }
            // Left & right arrows -> theme control
            else if (event.keyCode == 37 || event.keyCode == 39) {
                let htmlNode = document.getElementsByTagName('html')[0]
                Main.updateTheme(Main.theme == 'white-theme' ? 'dark-theme' : 'white-theme')
                EEG.quickClean = true
            }
        }
	})
})