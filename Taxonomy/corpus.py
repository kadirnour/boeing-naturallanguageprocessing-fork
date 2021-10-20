import subprocess

class BootCaT:
   
    # Opens BootCaT application, we should implement our own version of this
    def gatherDocs():
        response = input('Would you like to open BootCaT? (Y) ')

        #print('!Make sure to save corpora in \\Taxonomy\\extra_data and to remember the project name!')

        if response.lower() == 'y':
            subprocess.call('"C:\\Program Files\\BootCaT\\BootCaT.exe"') # Assumes this file location for BootCaT and waits until BootCaT finishes before continuing
        return response