import os
import csv
import ast

''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: create_weight_dictionary
Description: Finds frequencies and weights of terms
Returns: A dictionary with Key: term, Value: {frequency, weight}
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def create_weight_dictionary(output, files):
    weightDictionary = {}
    folder = os.listdir(output)
    filesCount = len(files)
    for file in folder:
        if file[0:-10] in files: # Skips files deleted from front end
            filePath = output + '\\' + file 
            data_write = []
            with open(filePath, 'r') as r:
                rowreader = csv.reader(r, delimiter=',')
                data_write.append(next(rowreader)) # skip first 3 lines
                data_write.append(next(rowreader))
                data_write.append(next(rowreader))
                for row in rowreader:
                    miniDict = {} # {frequency, weight}
                    frequency = int(row[2])
                    weight = frequency / filesCount
                    if row[0] in weightDictionary: # term is already in frequency_dict
                        miniDict = weightDictionary.get(row[0])
                        newFrequency = miniDict.get("frequency") + frequency
                        miniDict["frequency"] = newFrequency
                        row[2] = newFrequency
                        newWeight = newFrequency / filesCount
                        miniDict["weight"] = newWeight
                        row.append(newWeight)
                        miniDict["context"].append((file[0:-10], ast.literal_eval(row[1]))) # keep track of context
                        data_write.append(row)
                    else:
                        miniDict["frequency"] = frequency
                        miniDict["weight"] = weight
                        row.append(weight)
                        miniDict["context"] = [(file[0:-10], ast.literal_eval(row[1]))]
                        data_write.append(row)
                    weightDictionary[row[0]] = miniDict # update frequency_dict
    return weightDictionary


# NEVER USED?
# '''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: saveWeight
# Description: writes weights to .csv
# '''''''''''''''''''''''''''''''''''''''''''''''''''
# def saveWeight(folder, corpusName, weight):
#     file = folder + '\\' + corpusName + '.csv'
#     weightWriter = processDict(weight)
#     weightWrite(weightWriter, file)


# '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: processDict
# Description: gets weights and transforms them into correct formating
# Returns: weights
# '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# def processDict(weight):
#     weightReader = []
#     for term, data in weight.items():
#         rowData = []
#         rowData.append(term)
#         for field, value in data.items():
#             rowData.append(value)
#         weightReader.append(rowData)
#     return weightReader


# '''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: weightWrite
# Description: 
# '''''''''''''''''''''''''''''''''''''''''''''''''''
# def weightWrite(weightWriter,file):
#     with open(file, 'w', newline='') as write_obj:
#         csv_writer = csv.writer(write_obj)
#         for row in weightWriter:
#             csv_writer.writerow(row)