from Taxonomy import categorization 
from Taxonomy import corpus
from Taxonomy import extraction
from Taxonomy import convert2PDF

from Parser import main as parser

# Can interact with out code and old code

def main():
    response = corpus.BootCaT.gatherDocs() # Opens BootCaT app

    if response == 'y':
        convert2PDF.fpdf.convert() # Converts txt to pdf

    response = input('Create .csv of Nouns for documents? (Y) ')

    if response.lower() == 'y':
        parser.main() # Runs parser on new all files in \Parser\data

    # corpus.py: Use BootCaT to find related text and output to "extra_data" folder
    # extraction.py: Run parser on BootCaT corpus'. Calculate frequency and weights of each term
    # categorization.py: NER Tagger. Morpho-syntactic relations using oxford dictionary API
        
if __name__ == "__main__":
    main()