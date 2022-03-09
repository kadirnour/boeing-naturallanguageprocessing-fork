import csv
from Parser import main as Parser
from Taxonomy import extraction as Extraction
from Taxonomy import relationships
from flask import Flask
from flask import request
from Taxonomy import categories
from Taxonomy import saveWeights
from pathlib import Path
from ast import literal_eval
#from tests import unit_tests
from Data import main as Data


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: main
Description: runs all back-end functions
Returns: back-end results to front-end
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
app = Flask(__name__)


#########################################################
#                 Folder/ File Functions
#########################################################

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: getFiles
Description: gets all files from a given directory
Returns: file names and file types
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/getFiles', methods = ['POST'])
def getFiles():
    info = request.get_json(force=True)
    filesList = Data.getInputFiles(info['input'])
    return filesList


#########################################################
#                Parser/ Weight Functions
#########################################################

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: getTerms
Description: runs parser on given files from the input location and writes .csv's to output location.
Returns: all the nouns and send to front end
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/getTerms', methods = ['POST'])
def getTerms():
    info = request.get_json(force=True)
    total_nouns = Parser.parse(info['input'], info['output'], info['files'])
    return total_nouns


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: getWeights
Description: gets frequency and weights of terms from given files in output location
Returns: all the weights, freq and snoun data as dict and sends to front end
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/getWeights', methods = ['POST'])
def getWeights():
    info = request.get_json(force=True)
    return Extraction.find_frequencies_and_weights(info['output'], info['files'])



    
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: Weights
# Direction: Bac to Front
# Returns: all the weights, freq and snoun data as dict and sends to front end
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/saveCorpus', methods = ['POST'])
def saveCorpus():
    location = request.get_json(force=True)
    data = Extraction.find_frequencies_and_weights(location['output'], location['files'])
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


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: Weights
# Direction: Bac to Front
# Returns: all the weights, freq and snoun data as dict and sends to front end
'''''''''''''''''''''''''''''''''''''''''''''''''''
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
            

'''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: Weights
# Direction: Bac to Front
# Returns: all the weights, freq and snoun data as dict and sends to front end
'''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/saveWeight', methods = ['POST'])
def saveWeight():
    inputInfo = request.get_json(force=True)
    folder = inputInfo['input']
    weights = inputInfo['data']
    corpusName = inputInfo['corpusName']
    saveWeights.saveWeight(folder, corpusName, weights)
    return inputInfo


'''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: category
# Direction: Front to Back to front
# Returns: Helps to create the categories themselves
'''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/category', methods = ['POST'])
def category():
    category = request.get_json(force=True)
    return {category["Category"]: {}}


'''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: saveCategories
# Direction: Front to Back
# Returns: Retrieves dictionary of all the terms and cats and sends to method 
'''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/saveCategories', methods = ['POST'])
def saveCategories():
    inputInfo = request.get_json(force=True)
    folder = inputInfo['output']
    categoryDict = inputInfo['data']
    corpusName = inputInfo['corpusName']
    categories.receive_categories(folder, categoryDict, corpusName)
    return inputInfo


'''''''''''''''''''''''''''''''''''''''''''''''''''
# Function: saveCategories
# Direction: Front to Back
# Returns: Retrieves dictionary of all the terms and cats and sends to method 
'''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/saveRelationships', methods = ['POST'])
def saveRelationships():
    inputInfo = request.get_json(force=True)
    folder = inputInfo['input']
    corpus = inputInfo['corpus']
    edges = inputInfo['data1']
    nodes = inputInfo['data2']
    relationshipTypes = inputInfo['data3']
    relationships.saveRelationships(folder, corpus, edges, nodes, relationshipTypes)
    return inputInfo
