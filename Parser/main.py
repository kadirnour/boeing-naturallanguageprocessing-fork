import time as Time
from pathlib import Path
from Parser import noun as Noun
from Parser import Spacy
from Parser import text_factory
from Data import main as Data
#import multiprocessing

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: main
Description: parser functions
Returns: parser results to app.py
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
outDir = None
nounData = {}


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
WHAT DOES THIS DO???
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def initializer(output):
    global outDir
    outDir = output


#########################################################
#                  Parser Functions
#########################################################

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: parse
Description: runs parser on given files from input location
Returns: terms found and number of occurences of each term
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def parse(input, output, files):
    folder = Path(input)
    totalNouns = {}
    global outDir
    outDir = output

    for filePath in folder.iterdir():
        if filePath.stem in files:
            nouns = single_parse(filePath)
            for noun in nouns:
                totalNouns.__setitem__(noun.text, noun.occurances)

    return (totalNouns)


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: single_parse
Description: runs parser on given files from input location
Returns: terms found and number of occurences of each term
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def single_parse(filePath):
        startTime = Time.time()

        fileText = text_factory.get_text(filePath)
        terms = Spacy.get_terms(fileText) # gets nouns and noun phrases from each file's text

        elapsedTime = Time.time() - startTime
        totalTimeStr = "Total time: " + str(round(elapsedTime, 3)) + " sec"

        uniqueNouns = len(terms)
        totalNouns = Noun.get_total_nouns(terms)

        costPerNoun = (elapsedTime * 1000) / totalNouns
        costPerNounStr = "Cost per noun: " + str(round(costPerNoun, 3)) + " ms"

        Data.parser_to_csv(totalTimeStr, costPerNounStr, terms, uniqueNouns, totalNouns, filePath, outDir)

        return terms
        


# '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# WHAT DOES THIS DO?
# '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# # need correct chunks, capture output
# def parseAll(input, output, files):
#     print('starting process pool')
#     folder = Path(input)
#     total_nouns = {}
#     # TODO: filter folder based on files param before parsing in pool
#     with multiprocessing.Pool(5, initializer, [output]) as p: # limit number of processes to 5
#         results = p.map(singleParse, folder.iterdir())
#         for doc in results:
#             for noun in doc:
#                 total_nouns.__setitem__(noun.text, noun.num_occur)
#     return total_nouns


# '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# WHAT DOES THIS DO?
# '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
# # FOR TESTING ONLY
# if __name__ == "__main__":
#     start = time.time()
#     # parse("./Parser/data", "./Parser/output", [])
#     parseAll("./Parser/data", "./Parser/output", [])
#     print("***total time = {}".format(time.time() - start))