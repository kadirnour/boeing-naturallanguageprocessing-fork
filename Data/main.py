from pathlib import Path
import csv
import os

'''''''''''''''''''''''''''''''''''
Function: main.py
Description: data functions
'''''''''''''''''''''''''''''''''''

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


##################################################
#                CSV Functions
##################################################

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: to_csv
Description: Writes document information into a .csv file
'''''''''''''''''''''''''''''''''''''''''''''''''''
def to_csv(totalTimeStr, costPerNounStr, terms, uniqueNouns, totalNouns, filePath, outDir):
    output = Path(outDir)
    csv_name = filePath.stem + '_nouns.csv'

    with open(output / csv_name, 'w', newline='') as csvfile:
        nounwriter = csv.writer(csvfile)
        nounwriter.writerow([csv_name])
        nounwriter.writerow(["Unique nouns: " + str(uniqueNouns), "Total nouns: " + str(totalNouns)])
        nounwriter.writerow([totalTimeStr, costPerNounStr])

        for noun in terms:
            nounwriter.writerow([noun.text, noun.contextSentences, noun.occurances])