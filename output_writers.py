import csv
from logging import exception
import documentInformation
import os

# Output location
output = os.getcwd() + '\\output\\'


def to_csv(docInfo, totalTimeStr, costPerNounStr, total_nouns, unqNouns, sumNouns):
    # Open csv files to write to

    # print(docInfo.document_name)
    # print(docInfo.document_name)

    if docInfo.document_name != None:
        csv_name = docInfo.document_name + '_nouns.csv'
    else:
        # get name of file from file_path (removes ".pdf" too)
        csv_name = (docInfo.location.split('/'))[-1][:-4] + '_nouns.csv'

    # print(csv_name)
    if csv_name[0:4] == "data":
        csv_name = csv_name[5:]

    # Added encoding for non-printable characters
    with open(output + csv_name, 'w', newline='', encoding='utf-8') as csvfile:
        nounwriter = csv.writer(csvfile)
        # can add more attributes too
        nounwriter.writerow([docInfo.document_name, docInfo.authors])
        nounwriter.writerow(
            ["Unique nouns: " + str(unqNouns), " Total nouns: " + str(sumNouns)])
        nounwriter.writerow([totalTimeStr, costPerNounStr])

        for noun in total_nouns:

            try:
                nounwriter.writerow(
                    [noun.text, noun.context_sentences, noun.num_occur])
            except exception:
                print(exception, noun)

        print('Data has been successfully saved to ' + csv_name)

    return csv_name
