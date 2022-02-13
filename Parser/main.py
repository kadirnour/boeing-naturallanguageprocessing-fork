import multiprocessing
from Parser import Spacy
import time
from Parser import noun as Noun
from Parser import output_writers
from pathlib import Path
from Parser import text_factory
import os

out_dir = None # path to output directory
nounData = {}


# TODO: Conditions to check if input files and output location are correct
def getFiles(input, output):
    folder = Path(input) # folder location
    total_files = {}

    for file in folder.iterdir():
        total_files[file.stem] = os.path.splitext(file)[1]
    
    return (total_files)

# file input is string
def singleParse(file):
    # STEP 3: Start timer for each file
        startTime = time.time()

        # STEP 4: Get text from each file
        file_text = text_factory.get_text(file)

        # STEP 5: Get nouns and noun phrases from each file's text
        nouns = Spacy.run_parsers(file_text)

        # STEP 6: End timer and calculate total time spent on each file
        elapsedTime = time.time() - startTime
        totalTimeStr = "Total time: " + str(round(elapsedTime, 3)) + " sec"

        # STEP 7: Calculate number of unique nouns/noun phrases and total number of nouns/noun phrases in each file
        unqNouns = len(nouns)
        sumNouns = Noun.calculate_num_nouns_occur(nouns)

        # STEP 8: Calculate time spent on each noun and noun phrase
        costPerNoun = (elapsedTime * 1000) / sumNouns
        costPerNounStr = "Cost per noun: " + str(round(costPerNoun, 3)) + " ms"

        # STEP 9: Write this information into a .csv file
        output_writers.to_csv(totalTimeStr, costPerNounStr, nouns, unqNouns, sumNouns, file, out_dir)

        return nouns



'''''''''''''''''''''''''''''''''''''''''''''''''''
function: parse
description: main, runs all parser functions
parameters:
returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''
def parse(input, output, files):
    # STEP 1: Get input folder location
    folder = Path(input) # folder location
    print('starting', folder)
    total_nouns = {}
    global out_dir
    out_dir = output
    #print(files, "IASDMAFSNAIFIASFBN")

    # STEP 2: Get nouns and noun phrases from files in input folder
    for file in folder.iterdir():
        if file.stem in files: # Skips files deleted from front end
            nouns = singleParse(file)
            for noun in nouns:
                total_nouns.__setitem__(noun.text, noun.num_occur)

    return(total_nouns)

def initializer(output):
    global out_dir
    out_dir = output

# need correct chunks, capture output
def parseAll(input, output, files):
    print('starting process pool')
    folder = Path(input)
    total_nouns = {}

    # TODO: filter folder based on files param before parsing in pool


    with multiprocessing.Pool(5, initializer, [output]) as p: # limit number of processes to 5
        results = p.map(singleParse, folder.iterdir())
        for doc in results:
            for noun in doc:
                total_nouns.__setitem__(noun.text, noun.num_occur)

    return total_nouns

# FOR TESTING ONLY
if __name__ == "__main__":
    start = time.time()
    # parse("./Parser/data", "./Parser/output", [])
    parseAll("./Parser/data", "./Parser/output", [])
    print("***total time = {}".format(time.time() - start))