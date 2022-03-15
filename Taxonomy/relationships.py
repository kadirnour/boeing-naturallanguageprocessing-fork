from Data import main as Data

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: write_to_csv
Description: used to write relationnships to .csv
'''''''''''''''''''''''''''''''''''''''''''''''''''
def write_to_csv(input, corpus, edges, nodes, relationshipTypes):
    file = input + '\\' + corpus + '_relationships.csv'
    dataWrite = []
    dataWrite.append(edges)
    dataWrite.append(nodes)
    dataWrite.append(relationshipTypes)
    Data.write_to_csv(dataWrite, file)