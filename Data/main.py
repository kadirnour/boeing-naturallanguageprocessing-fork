from pathlib import Path
from ast import literal_eval
import csv
import os
import json

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: main.py
Description: all file and csv functions will be called from here
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

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


########################################################################################################
#                                             CSV Functions
########################################################################################################

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: parser_to_csv
Description: Writes terms found in parser to .csv file
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def parser_to_csv(totalTimeStr, costPerNounStr, terms, uniqueNouns, totalNouns, filePath, outDir):
    output = Path(outDir)
    csv_name = filePath.stem + '_nouns.csv'
    with open(output / csv_name, 'w', newline='') as csvfile:
        nounwriter = csv.writer(csvfile)
        nounwriter.writerow([csv_name])
        nounwriter.writerow(["Unique nouns: " + str(uniqueNouns), "Total nouns: " + str(totalNouns)])
        nounwriter.writerow([totalTimeStr, costPerNounStr])
        for noun in terms:
            nounwriter.writerow([noun.text, noun.contextSentences, noun.occurances])

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: write_weights
Description: write weights to file
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def write_weights(file, termsDictionary):
    with open(file, 'w', newline='') as master:
        master.truncate(0)
        writer = csv.writer(master)
        for term in termsDictionary:
            context = termsDictionary[term]['context']
            freq = termsDictionary[term]['frequency']
            weight = termsDictionary[term]['weight']
            writer.writerow([term, context, freq, weight])

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: read_weights
Description: read weights from file
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def read_weights(dir, taxonomyName):
    vis_data = {}
    taxonomy_data = {}
    visName = taxonomyName + '_relationships.json'
    taxonomyName = taxonomyName + '.csv'

    if Path(dir / taxonomyName).exists():
        with open(dir / taxonomyName, 'r') as taxonomy: # loads weights 
            rowreader = csv.reader(taxonomy, delimiter=',')
            for row in rowreader:
                if len(row) == 5:
                    taxonomy_data.update({row[0]: {"context": literal_eval(row[1]), "frequency": row[2], "weight": row[3], "category": row[4]}})
                else:
                    taxonomy_data.update({row[0]: {"context": literal_eval(row[1]), "frequency": row[2], "weight": row[3]}})
    
    if Path(dir / visName).exists():
        with open(dir / visName, 'r') as f: # loads visualization
            vis_data = json.load(f)
    else:
        vis_data['graph'] = {'nodes': [], 'edges': []}
        vis_data['relationships'] = []

    return {'taxonomy': taxonomy_data, 'graph': vis_data['graph'], 'relationships': vis_data['relationships']}

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: write_to_csv
Description: writes to .csv
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def write_to_csv(data_write, file_path):
    with open(file_path, 'w', newline='') as write_obj:
        csv_writer = csv.writer(write_obj)
        for row in data_write:
            csv_writer.writerow(row)

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: write_to_json
Description: writes to .json
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def write_to_json(data, file):
    with open(file, 'w', encoding='UTF-8') as f: # TODO:  change to use Pathlib for reproducible results
        json.dump(data, f, indent=4)
