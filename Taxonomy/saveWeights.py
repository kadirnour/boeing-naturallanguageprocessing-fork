#from csv import reader
import csv

#Saves weights from state to csv everytime button is pressed to reflect changes#

# master method that takes
'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: 
Description: 
Returns: 
'''''''''''''''''''''''''''''''''''''''''''''''''''
def saveWeight(folder,corpusName,weight):
    file = folder + '\\' + corpusName + '.csv' # csv from folder
    weightWriter = processDict(weight)

    weightWrite(weightWriter,file)


'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: 
Description: 
Returns: 
'''''''''''''''''''''''''''''''''''''''''''''''''''
def processDict(weight):
    weightReader = []
    for term,data in weight.items():
        rowData = []
        rowData.append(term)
        for field,value in data.items():
            rowData.append(value)
        weightReader.append(rowData)
    print(weightReader)
    return weightReader


'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: 
Description: 
Returns: 
'''''''''''''''''''''''''''''''''''''''''''''''''''
def weightWrite(weightWriter,file):
    with open(file, 'w', newline='') as write_obj:
        csv_writer = csv.writer(write_obj)
        for row in weightWriter:
            csv_writer.writerow(row)