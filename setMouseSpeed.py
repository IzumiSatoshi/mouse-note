import ctypes

SPI_SETMOUSESPEED = 113  # This constant is used to set mouse speed
SPIF_UPDATEINIFILE = 0x01  # Writes the new system-wide parameter setting to the user profile.
SPIF_SENDCHANGE = 0x02  # Broadcasts the WM_SETTINGCHANGE message after updating the user profile.
MOUSESPEED = 5

ctypes.windll.user32.SystemParametersInfoW(SPI_SETMOUSESPEED, 0, MOUSESPEED, SPIF_UPDATEINIFILE | SPIF_SENDCHANGE)