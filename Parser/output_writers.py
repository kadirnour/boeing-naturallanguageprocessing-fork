import csv
from pathlib import Path

'''''''''''''''''''''''''''''''''''''''''''''''''''
function: to_csv
description: Writes document information into a .csv file
parameters: Time to find all nouns. Average time to find nouns. List of noun objects found. 
            Number of unique nouns found. Total number of nouns found. File nouns are found in.
returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''
def to_csv(totalTimeStr, costPerNounStr, total_nouns, unqNouns, sumNouns, file):
    # STEP 1: Get path and file name
    output = Path('Parser/output') # output folder location
    csv_name = file.stem + '_nouns.csv' # name of .csv file

    # STEP 2: Write to .csv file
    with open(output / csv_name, 'w', newline='') as csvfile:
        nounwriter = csv.writer(csvfile)
        nounwriter.writerow([csv_name])
        nounwriter.writerow(["Unique nouns: " + str(unqNouns), "Total nouns: " + str(sumNouns)])
        nounwriter.writerow([totalTimeStr, costPerNounStr])

        for noun in total_nouns:
            nounwriter.writerow([noun.text, noun.context_sentences, noun.num_occur])
        print('Data has been successfully saved to ' + csv_name)