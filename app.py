from Parser import main as parser
from Taxonomy import extraction
from Taxonomy import categories
from tests import unit_tests
from flask import Flask
from flask import request

# from tkinter import Tk
# from tkinter import filedialog

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

# Route to run parser and returns a list of all nouns found
@app.route('/parse', methods = ['POST'])
def parse():
    location = request.get_json(force=True)
    total_nouns = parser.parse(list(location.values())[0], list(location.values())[1])
    return total_nouns

# Route to run weights and returns list of all weights found
@app.route('/weights', methods = ['POST'])
def weights():
    location = request.get_json(force=True)
    return extraction.find_frequencies_and_weights(list(location.values())[0])

# NEED TO IMPLEMENT
# Round to create a new category for taxonomy
@app.route('/category', methods = ['POST'])
def category():
    category = request.get_json(force=True)
    print(category["Category"])
    return {category["Category"]: {}}
