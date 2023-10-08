#Persistent ; Keep the script running
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.

; These are the constants for the SystemParametersInfo function
SPI_GETMOUSESPEED := 0x0070
SPI_SETMOUSESPEED := 0x0071
uiParam := 0
pvParam := VarSetCapacity(pvParam, 4, 0) ; Allocate memory for the speed value

normalSpeed := 10 ; Default speed is 10 (range is 1-20)
modifiedSpeed := 5

; Get the current mouse speed at the start
DllCall("SystemParametersInfo", UInt, SPI_GETMOUSESPEED, UInt, uiParam, Ptr, &pvParam, UInt, 0)
normalSpeed := NumGet(pvParam)

^!+m:: ; Ctrl + Alt + Shift + M
    ; Set the mouse speed to a lower value (e.g., 3). You can adjust this value as needed.
    DllCall("SystemParametersInfo", UInt, SPI_SETMOUSESPEED, UInt, 0, Int, modifiedSpeed, UInt, 0)
return

^!+n:: ; Ctrl + Alt + Shift + N
    ; Restore the mouse speed to its original value
    DllCall("SystemParametersInfo", UInt, SPI_SETMOUSESPEED, UInt, 0, Int, normalSpeed, UInt, 0)
return