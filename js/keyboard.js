document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keyup", (event) => {
        // Space bar
		if (event.keyCode == 32) {
            if (Main.activateKeyboardControl) {
                if (Picker.captured) Picker.release()
                else Picker.capture()
            }
            
        }
	})
})