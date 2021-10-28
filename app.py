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

    # TODO:
    # corpus.py: Use BootCaT to find related text and output to "extra_data" folder
    # convert2PDF.py: Converts .txt to .pdf and saves to Parser\data
    # extraction.py: Run parser on corpus in Parser\output. Calculate frequency and weights of each term
    # categorization.py: NER Tagger. Morpho-syntactic relations using oxford dictionary API


if __name__ == "__main__":
    main()
