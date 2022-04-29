from Parser import Spacy
from Parser import text_factory
from pathlib import Path
import time

test_data = Path('tests/test_data/speed_test_files')

def test_speed_small():
    print("starting speed test for a small file")
    start = time.time()
    text = text_factory.get_text(test_data / '737_Pilot_Operating_Manual.pdf')
    total_nouns = Spacy.get_terms(text)
    end = time.time()
    print("Small file took", round(end - start), "sec")

# def test_speed_medium():
#     start = time.time()
#     text = text_factory.get_text(test_data / file)
#     total_nouns = Spacy.get_terms(text)
#     end = time.time()
#     print(end - start)

# def test_speed_large():
#     start = time.time()
#     text = text_factory.get_text(test_data / file)
#     total_nouns = Spacy.get_terms(text)
#     end = time.time()
#     print(end - start)
    
if __name__ == "__main__":
    test_speed_small()