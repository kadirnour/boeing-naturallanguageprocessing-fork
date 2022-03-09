import csv
from Data import main as Data

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: create_taxonomy_dictionary
Description: converts categories into the correct output
Returns: dictionary of categories
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def create_taxonomy_dictionary(input):
    taxDict = {}
    for category, terms in input.items():
        termList = {}
        for term, values in terms.items():
            termList[term]=values['weight']
        taxDict[category] = termList
    return taxDict


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: write_to_csv
Description: appends categories to main corpus .csv
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def write_to_csv(output, corpus, taxDict):
    file = output + '\\' + corpus + '.csv'
    dataWrite = []

    with open(file, 'r') as read_obj:    
        csv_reader = csv.reader(read_obj, delimiter=',')
        
        dataWrite.append(next(csv_reader)) # skip 3 lines
        dataWrite.append(next(csv_reader))
        dataWrite.append(next(csv_reader))

        for row in csv_reader:
            if len(row) >= 5:
                row[4] = " "
            for category,terms in taxDict.items():
                for term in terms.items():
                    if row[0]==term:                        
                        if len(row) < 5:
                            row.append(category)
                        elif len(row) == 5:
                            row[4] = category
                        else:
                            pass
            dataWrite.append(row)

    Data.write_to_csv(dataWrite, file)