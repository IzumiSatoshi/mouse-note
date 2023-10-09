
import ctypes

SPI_GETMOUSESPEED = 112  # This constant is used to get mouse speed
SPI_SETMOUSESPEED = 113  # This constant is used to set mouse speed

def get_mouse_speed():
    """Get the current mouse speed. Returns a value between 1 (slowest) and 20 (fastest)."""
    speed = ctypes.c_int()
    ctypes.windll.user32.SystemParametersInfoW(SPI_GETMOUSESPEED, 0, ctypes.byref(speed), 0)
    return speed.value

# Example usage:
current_speed = get_mouse_speed()
print(f"Current mouse speed: {current_speed}")