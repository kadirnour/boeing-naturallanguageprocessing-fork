from flask import Flask
from flask import request
from pathlib import Path
#from tests import unit_tests

from Parser import main as Parser
from Data import main as Data
from Taxonomy import main as Taxonomy


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: main
Description: runs all back-end functions
Returns: back-end results to front-end
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
app = Flask(__name__)


#####################################################################################################
#                                       Folder/ File Functions
#####################################################################################################

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


#####################################################################################################
#                                        Parser/ Weight Functions
#####################################################################################################

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: getTerms
Description: runs parser on given files from the input location and writes .csv's to output location.
Returns: all the nouns and send to front end
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/getTerms', methods = ['POST'])
def getTerms():
    info = request.get_json(force=True)
    totalNouns = Parser.parse(info['input'], info['output'], info['files'])
    return totalNouns


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: getWeights
Description: gets frequency and weights of terms from given files in output location
Returns: weights dictionary
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/getWeights', methods = ['POST'])
def getWeights():
    info = request.get_json(force=True)
    return Taxonomy.get_weight_dictionary(info['output'], info['files'])


#####################################################################################################
#                                        Save/ Load Functions
#####################################################################################################

'''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: saveTaxonomy
Description: writes weights to the master taxonomy
'''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/saveTaxonomy', methods = ['POST'])
def saveTaxonomy():
    info = request.get_json(force=True)
    taxonomyName = info['taxonomy'] + '.csv'
    Data.write_weights(Path(info['output']) / taxonomyName, info['termsDictionary'])
    return ""


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: loadTaxonomy
Description: reads terms from master taxonomy
Returns: terms and context
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/loadTaxonomy', methods = ['POST'])
def loadTaxonomy():
    location = request.get_json(force=True)
    return Data.read_weights(Path(location['output']), location['taxonomy'])
       

'''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: saveCategories
Description: writes the categories to the master .csv
'''''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/saveCategories', methods = ['POST'])
def saveCategories():
    inputInfo = request.get_json(force=True)
    Taxonomy.write_categories(inputInfo['output'], inputInfo['taxonomy'], inputInfo['categories'])
    return ""


'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: saveRelationships
Description: writes relationships to .csv
'''''''''''''''''''''''''''''''''''''''''''''''''''
@app.route('/saveRelationships', methods = ['POST'])
def saveRelationships():
    inputInfo = request.get_json(force=True)
    Taxonomy.write_relationships(inputInfo['output'], inputInfo['taxonomy'], inputInfo['graph'], inputInfo['relationships'])
    return ""
