from Parser import main as parser
from Taxonomy import extraction

# Can interact with out code and old code

def main():
    parser.main()

    parsed_terms = extraction.Parsing.extract_frequencies_from_csv()
    print(parsed_terms)

if __name__ == "__main__":
    main()
