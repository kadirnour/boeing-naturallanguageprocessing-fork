from Parser import Spacy
import time
from Parser import noun as Noun
from Parser import output_writers
from pathlib import Path
from Parser import text_factory

'''''''''''''''''''''''''''''''''''''''''''''''''''
function: parse
description: main, runs all parser functions
parameters:
returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''
def parse():
    # STEP 1: Get input folder location
    folder = Path('Parser/data') # folder location
    print('starting')

    # STEP 2: Get nouns and noun phrases from files in input folder
    for file in folder.iterdir():
        # STEP 3: Start timer for each file
        startTime = time.time()

        # STEP 4: Get text from each file
        file_text = text_factory.get_text(file)

        # STEP 5: Get nouns and noun phrases from each file's text
        total_nouns = Spacy.run_parsers(file_text)

        # STEP 6: End timer and calculate total time spent on each file
        elapsedTime = time.time() - startTime
        totalTimeStr = "Total time: " + str(round(elapsedTime, 3)) + " sec"

        # STEP 7: Calculate number of unique nouns/noun phrases and total number of nouns/noun phrases in each file
        unqNouns = len(total_nouns)
        sumNouns = Noun.calculate_num_nouns_occur(total_nouns)

        # STEP 8: Calculate time spent on each noun and noun phrase
        costPerNoun = (elapsedTime * 1000) / sumNouns
        costPerNounStr = "Cost per noun: " + str(round(costPerNoun, 3)) + " ms"

        # STEP 9: Write this information into a .csv file
        output_writers.to_csv(totalTimeStr, costPerNounStr, total_nouns, unqNouns, sumNouns, file)