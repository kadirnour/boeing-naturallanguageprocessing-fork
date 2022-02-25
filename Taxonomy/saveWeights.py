#Saves weights from state to csv everytime button is pressed to reflect changes#


def saveWeight(folder,corpusName,weight):
    #print(folder)
    #print(corpusName)
    file = folder + '\\' + corpusName + '.csv' # csv from folder
    print(file)
    #print(weight)
    weightWrite = []
    weightWrite = processDict(weight)


def processDict(weight):
    weightWrite = []
    for term,data in weight.items():
        rowData = []
        rowData.append(term)
        for field,value in data.items():
            rowData.append(value)
        weightWrite.append(rowData)
    print(weightWrite)
    return weightWrite