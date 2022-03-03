import csv
from Parser import main as parser
from Taxonomy import extraction, relationships
from tests import unit_tests
from flask import Flask
from flask import request
from Taxonomy import categories
from Taxonomy import saveWeights
from pathlib import Path
from ast import literal_eval

# from tkinter import Tk
# from tkinter import filedialog

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: main
Description: main, runs all functions
Parameters:
Returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''
# def main():
#     # STEP 1: Run parser and extract terms from documents
#     parser.parse()

#     # STEP 2: Find frequencies and weights of terms
#     parsed_terms = extraction.find_frequencies_and_weights()
#     print(parsed_terms)

#     unit_tests.test_accuracy()


# if __name__ == "__main__":
#     main()

app = Flask(__name__)



# TODO: Need functions to check if file locations are correct.
@app.route('/files', methods = ['POST'])
def files():
    location = request.get_json(force=True)
    files = parser.getFiles(list(location.values())[0], list(location.values())[1])
    return files


#################################################################################################
# Function: Parse
# Direction: Bac to Front
# Returns: all the nouns and send to front end
#################################################################################################
@app.route('/parse', methods = ['POST'])
def parse():
    #json = {'time' : "HERE"}
    location = request.get_json(force=True)



    #print(location)
    #print(list(location.values())[2])
    total_nouns = parser.parse(list(location.values())[0], list(location.values())[1], list(location.values())[2])



    print(location)
    print(list(location.values())[0])
    #total_nouns = parser.parse(list(location.values())[0], list(location.values())[1])

    return total_nouns
    #selectFolder()

#################################################################################################
# Function: Weights
# Direction: Bac to Front
# Returns: all the weights, freq and snoun data as dict and sends to front end
#################################################################################################
@app.route('/weights', methods = ['POST'])
def weights():
    location = request.get_json(force=True)



    return extraction.find_frequencies_and_weights(list(location.values())[0], list(location.values())[1])



    #print(location)
    #return extraction.find_frequencies_and_weights(list(location.values())[0])

@app.route('/saveCorpus', methods = ['POST'])
def saveCorpus():
    location = request.get_json(force=True)
    data = extraction.find_frequencies_and_weights(location['output'], location['files'])

    print(location)
    corpusName = location['corpusName'] + '.csv'
    # TODO: save freq_dict to csv
    with open(Path(location['output']) / corpusName, 'w', newline='') as master:

        master.truncate(0)
        writer = csv.writer(master)
        for term in data:
            context = data[term]['context']
            freq = data[term]['frequency']
            weight = data[term]['weight']
            writer.writerow([term, context, freq, weight])
    return "hehe"

@app.route('/loadCorpus', methods = ['POST'])
def loadCorpus():
    location = request.get_json(force=True)
    corpusName = location['corpusName'] + '.csv'
    data = {}

    with open(Path(location['output']) / corpusName, 'r') as corpus:
        rowreader = csv.reader(corpus, delimiter=',')
        for row in rowreader:
            # row = [term, (doc, context), freq, weight, category?]
            if len(row) == 5:
                data.update({row[0]: {"context": literal_eval(row[1]), "frequency": row[2], "weight": row[3], "category": row[4]}})
            else:
                data.update({row[0]: {"context": literal_eval(row[1]), "frequency": row[2], "weight": row[3]}})
    return data
            

@app.route('/saveWeight', methods = ['POST'])
def saveWeight():
    inputInfo = request.get_json(force=True)
    #print(inputInfo)
    #print(inputInfo['data'])

    #retrieves file location
    folder = inputInfo['input']

    #retrieves category dictionary from the front end
    weights = inputInfo['data']

    corpusName = inputInfo['corpusName']

    saveWeights.saveWeight(folder, corpusName, weights)

    return inputInfo

# @app.route('/folder')
# def folder():
#     #Tk().withdraw() # we don't want a full GUI, so keep the root window from appearing
#     #dir = filedialog.askdirectory()
#     return {'directory': dir}

#################################################################################################
# Function: category
# Direction: Front to Back to front
# Returns: Helps to create the categories themselves
#################################################################################################
@app.route('/category', methods = ['POST'])
def category():
    category = request.get_json(force=True)
    print(category)
    #return categories.receive_categories(category)
    return {category["Category"]: {}}

#################################################################################################
# Function: saveCategories
# Direction: Front to Back
# Returns: Retrieves dictionary of all the terms and cats and sends to method 
#################################################################################################
@app.route('/saveCategories', methods = ['POST'])
def saveCategories():
    inputInfo = request.get_json(force=True)
    #print(inputInfo['input'])
    #print(inputInfo['data'])

    #retrieves file location
    folder = inputInfo['input']

    #retrieves category dictionary from the front end
    categoryDict = inputInfo['data']

    corpusName = inputInfo['corpusName']

    #Send to the csv writer
    categories.receive_categories(folder, categoryDict, corpusName)

    return inputInfo

@app.route('/saveRelationships', methods = ['POST'])
def saveRelationships():
    inputInfo = request.get_json(force=True)
    #print(inputInfo)
    #print(inputInfo['data'])

    #retrieves file location
    folder = inputInfo['input']
    print(folder)

    #retrieves category dictionary from the front end
    edges = inputInfo['data1']
    print(edges)

    nodes = inputInfo['data2']
    print(nodes)

    relationshipTypes = inputInfo['data3']
    print(relationshipTypes)

    relationships.saveRelationships(folder, edges, nodes, relationshipTypes)

    return inputInfo
""" 
@app.route('/sendTaxonomy', methods = ['POST'])
def sendTaxonomy():
    location = request.get_json(force=True)
    return taxonomy.taxonomySender(location)
    #return categories.receive_categories(inputInfo) """