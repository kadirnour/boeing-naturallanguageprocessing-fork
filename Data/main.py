from pathlib import Path
import os

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: main.py
Description: back-end functions to retrieve folder locations
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

##################################################
#                File Functions
##################################################

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: getInputFiles
Description: returns files from input location
Return: dictionary {file name: file extension}
'''''''''''''''''''''''''''''''''''''''''''''''''''
def getInputFiles(input):
    folder = Path(input)
    total_files = {}

    for file in folder.iterdir():
        total_files[file.stem] = os.path.splitext(file)[1]
    
    return (total_files)
