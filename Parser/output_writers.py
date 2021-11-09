import csv
#import documentInformation
from pathlib import Path

# Output location
# Added \\parser to fix output location
output = Path('Parser/output')

# Removed doc info, wasn't being used
def to_csv(totalTimeStr, costPerNounStr, total_nouns, unqNouns, sumNouns, file):  # Open csv files to write to
    # Removed, gets doc name from file name instead
    # if docInfo.document_name != None:
    #     csv_name = docInfo.document_name + '_nouns.csv'
    # else:
    #     csv_name = (docInfo.location.split('/'))[-1][:-4] + '_nouns.csv' # get name of file from file_path (removes ".pdf" too)

    # Changed logic so that it uses file name instead of docInfo.document_name (removes ".pdf" too)
    # csv_name = (file.split('/'))[-1][:-4] + '_nouns.csv'
    csv_name = file.stem + '_nouns.csv'

    # Removed, used to needd to remove the file directory /data
    # if csv_name[0:4] == "data":
    #     csv_name = csv_name[5:]

    # Added encoding for non-printable characters
    with open(output / csv_name, 'w', newline='', encoding='utf-8') as csvfile: # Add ability to update xcl while it is open!!!!!!!!!!!!!!!!!!!!!!
        nounwriter = csv.writer(csvfile)
        nounwriter.writerow([csv_name])
        # , docInfo.authors]) Not really necessary for now
        nounwriter.writerow(
            ["Unique nouns: " + str(unqNouns), " Total nouns: " + str(sumNouns)])
        nounwriter.writerow([totalTimeStr, costPerNounStr])

        for noun in total_nouns:
            # try: Adding in encoding='utf-8' fixed this issue
            nounwriter.writerow(
                [noun.text, noun.context_sentences, noun.num_occur])
            # except UnicodeEncodeError:
            # print(noun)

        print('Data has been successfully saved to ' + csv_name)

    return csv_name
