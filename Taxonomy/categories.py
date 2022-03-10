import csv
from Data import main as Data

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: create_taxonomy_dictionary
Description: converts categories into an easy to process output
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
Description: appends/updates categories to main corpus .csv:

Case 1: If the cateory in CSV exists already, replace with empty string
Case 2: If row length is less than 5, append the category
Case 3: If 5 but empty space, update
Case 4: We pass

Return: None

Note: Even though we do not use the value "weight" 
in the dictionary, we still need both key,value
to access the key "term". KEEP WEIGHT IN!!!
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def write_to_csv(output, corpus, taxDict):
    file = output + '\\' + corpus + '.csv'
    dataWrite = []
    with open(file, 'r') as read_obj:    
        csv_reader = csv.reader(read_obj, delimiter=',')
        for row in csv_reader:
            if len(row) >= 5:
                row[4] = " "

            for category,terms in taxDict.items():
                for term,weight in terms.items():
                    if row[0]==term:                        
                        if len(row) < 5:
                            row.append(category)
                        elif len(row) == 5:
                            row[4] = category
                        else:
                            pass
            dataWrite.append(row)
    Data.write_to_csv(dataWrite, file)