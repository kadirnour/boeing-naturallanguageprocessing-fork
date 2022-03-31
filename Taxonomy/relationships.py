from Data import main as Data

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: write_to_json
Description: used to write relationnships to .json file
'''''''''''''''''''''''''''''''''''''''''''''''''''
def write_to_json(output, corpus, graph, edgeTypes):
    file = output + '\\' + corpus + '_relationships.json'

    data = {
        'graph': graph,
        'edgeTypes': edgeTypes
    }

    Data.write_to_json(data, file)