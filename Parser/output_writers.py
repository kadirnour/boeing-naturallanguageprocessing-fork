import csv
from pathlib import Path

# Output location
output = Path('Parser/output')

# Removed doc info, wasn't being used
def to_csv(totalTimeStr, costPerNounStr, total_nouns, unqNouns, sumNouns, file):  # Open csv files to write to
    # Changed logic so that it uses file name instead of docInfo.document_name (removes ".pdf" too)
    csv_name = file.stem + '_nouns.csv'

    # Added encoding for non-printable characters
    with open(output / csv_name, 'w', newline='', encoding='utf-8') as csvfile: # Add ability to update xcl while it is open!!!!!!!!!!!!!!!!!!!!!!
        nounwriter = csv.writer(csvfile)
        nounwriter.writerow([csv_name])
        nounwriter.writerow(
            ["Unique nouns: " + str(unqNouns), " Total nouns: " + str(sumNouns)])
        nounwriter.writerow([totalTimeStr, costPerNounStr])

        for noun in total_nouns:
            nounwriter.writerow(
                [noun.text, noun.context_sentences, noun.num_occur])

        print('Data has been successfully saved to ' + csv_name)

    return csv_name
