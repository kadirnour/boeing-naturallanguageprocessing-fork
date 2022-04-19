import time
from pathlib import Path
from Parser import Spacy
from Parser import text_factory
from tests.test_data.test_term_dictionaries import *

test_data = Path('tests/test_data')

def test_accuracy(file, check):
    text = text_factory.get_text(test_data / file)
    total_nouns = Spacy.get_terms(text)
    correct_counts = 0
    extra_counts = 0
    d = {}
    print("---------------------------------------------------------")
    print("Expected:")
    print("---------------------------------------------------------\n")
    {print(x, ", ", check[x]) for x in check}
    print("\n---------------------------------------------------------")
    for noun in total_nouns:
        d[noun.text] = noun.occurances
        if(noun.text in check):
            correct_counts += 1
        else:
            extra_counts += 1
    print("Actual:")
    print("---------------------------------------------------------\n")
    {print(noun, ", ", occur) for noun, occur, in d.items()}
    print("\n---------------------------------------------------------\n")
    print(str(correct_counts) + '/' + str(len(check)) + " Terms Found")
    print(str(extra_counts) + " False Positives")
    print(str(sum(check.values())) + " Expected Occur")
    print(str(sum(d.values())) + " Actual Occur")
    # print("Total accuracy = " + str(round(correct_counts / sum(d.values()), 2) * 100))

def test_accuracy_blank():
    test_accuracy((test_data / 'txt_files'/ 'blank.txt'), BlankDocumentTerms)


if __name__ == '__main__':
    print((test_data / 'txt_files'/ 'blank.txt').exists())