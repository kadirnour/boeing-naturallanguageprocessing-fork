from Parser import main as parser
from Taxonomy import extraction

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: main
Description: main, runs all functions
Parameters:
Returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''
def main():
    # STEP 1: Run parser and extract terms from documents
    parser.parse()

    # STEP 2: Find frequencies and weights of terms
    parsed_terms = extraction.find_frequencies_and_weights()
    #print(parsed_terms)


if __name__ == "__main__":
    main()