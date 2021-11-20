from Parser import Spacy
import time
from Parser import noun as Noun
from Parser import output_writers
from pathlib import Path
from Parser import text_factory

def main():
    print('starting')
    data = Path('Parser/data')

    for file in data.iterdir():
        # start timer
        startTime = time.time()

        # Get text from file
        text = text_factory.get_text(file)

        # parse file
        total_nouns = Spacy.run_parsers(text)

        # end timer
        elapsedTime = time.time() - startTime
        totalTimeStr = "Total time: " + str(round(elapsedTime, 3)) + " sec" # used in .csv file

        # calculate unique nouns, total nouns
        unqNouns = len(total_nouns)
        sumNouns = Noun.calculate_num_nouns_occur(total_nouns)

        # calculate cost per noun in milliseconds
        costPerNoun = (elapsedTime * 1000) / sumNouns
        costPerNounStr = "Cost per noun: " + str(round(costPerNoun, 3)) + " ms" # used in .csv file

        output_writers.to_csv(totalTimeStr, costPerNounStr, total_nouns, unqNouns, sumNouns, file)

if __name__ == "__main__":
    main()
