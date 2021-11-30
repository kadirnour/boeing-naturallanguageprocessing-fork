from Parser import main as parser
from Taxonomy import extraction
from tests import unit_tests
from flask import Flask

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: main
Description: main, runs all functions
Parameters:
Returns:
'''''''''''''''''''''''''''''''''''''''''''''''''''
# def main():
#     # STEP 1: Run parser and extract terms from documents
#     parser.parse()

#     # STEP 2: Find frequencies and weights of terms
#     parsed_terms = extraction.find_frequencies_and_weights()
#     print(parsed_terms)

#     unit_tests.test_accuracy()


# if __name__ == "__main__":
#     main()

app = Flask(__name__)

# @app.route('/path1')
# def path1():
#     print("HERE")
#     return "HELLO WORLD!"

@app.route('/path2')
def path2():
    json = {'time' : "HERE"}
    return json
    #selectFolder()