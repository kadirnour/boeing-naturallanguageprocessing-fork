from Data import main as Data

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: write_to_json
Description: used to write relationnships to .json file
'''''''''''''''''''''''''''''''''''''''''''''''''''
def write_to_json(input, corpus, graph, relationshipTypes):
    file = input + '\\' + corpus + '_relationships.json'

    data = {
        'graph': graph,
        'relationshipTypes': relationshipTypes
    }

    Data.write_to_json(data, file)