#from csv import reader
#import csv
from Data import main as Data

#Saves weights from state to csv everytime button is pressed to reflect changes#

# master method that takes
'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: Save Weights
Description: Gets the file location for the weights save.
Calls the process dictionary method to create easy to write list.
Then calls the writer to write to the csv.
Returns: Void
'''''''''''''''''''''''''''''''''''''''''''''''''''
def saveWeight(folder,corpusName,weight):
    file = folder + '\\' + corpusName + '.csv' # csv from folder
    weightWriter = processDict(weight)
    Data.write_to_csv(weightWriter,file)


'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: Process Dictionary
Description: Turns the weights dictionary to easy write
list.
Returns: weightReader List
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