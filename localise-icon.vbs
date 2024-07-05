Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c md %appdata%\.dodex", 0, False
WshShell.Run "cmd /c copy resources\icon.ico %appdata%\.dodex\icon.ico", 0, False