from Taxonomy import categorization
from Taxonomy import corpus
from Taxonomy import extraction
from Taxonomy import convert2PDF
from Taxonomy import categorization

from Parser import main as parser

# Can interact with out code and old code


def main():
    parser.main()

    # response = corpus.BootCaT.gatherDocs()  # Opens BootCaT app

    # if response == 'y':
    #     convert2PDF.fpdf.convert()  # Converts txt to pdf

    # response = input('Create .csv of Nouns for documents? (Y) ')

    # if response.lower() == 'y':
    #     parser.main()  # Runs parser on new all files in \Parser\data

    # response = input('Create dict of weights for terms? (Y) ')

    # if response.lower() == 'y':
    #     parsed_terms = extraction.Parsing.extract_frequencies_from_csv()
    #     categorization.categorization.term_categorization(
    #         list(parsed_terms.keys()))



if __name__ == "__main__":
    main()
