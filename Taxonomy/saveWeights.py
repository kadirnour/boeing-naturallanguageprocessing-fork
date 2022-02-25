#Saves weights from state to csv everytime button is pressed to reflect changes#


from csv import reader
import csv


def saveWeight(folder,corpusName,weight):
    #print(folder)
    #print(corpusName)
    file = folder + '\\' + corpusName + '.csv' # csv from folder
    print(file)
    #weightReader.append(next(csv_reader))
    weightWriter = processDict(weight)
    weightWrite(weightWriter,file)

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


def weightWrite(weightWriter,file):
    with open(file, 'w', newline='') as write_obj:
        csv_writer = csv.writer(write_obj)
        for row in weightWriter:
            csv_writer.writerow(row)

'''
def data_writer(data_write, file_path):
    with open(file_path, 'r') as read_obj, \
        open(file_path, 'w', newline='') as write_obj:
        
        # Create a csv.writer object from the output file object
        csv_writer = csv.writer(write_obj)
        
        # Read each row of the input csv file as list
        for row in data_write:
            csv_writer.writerow(row)'''