import subprocess

class BootCaT:
   
    def gatherDocs():
        while True:
            response = input('Would you like to open BootCaT? (Y/N) ')
            if response.lower() == 'y':
                subprocess.call('"C:\\Program Files\\BootCaT\\BootCaT.exe"') # Assumes this file location for BootCaT
                return response # Also waits until BootCaT finishes before continuing
            elif response.lower() == 'n':
                return response
            else:            
                response = input('Would you like to open BootCaT? (Y/N)')

