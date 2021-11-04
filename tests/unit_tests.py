from Parser import Spacy as parsers
# import database
from Parser import output_writers
import os
from os import path

from pathlib import Path

test_data = Path('tests/test_data')
output = Path('Parser/output')

# TODO: make multiple dicionaries with varying sizes, counts and punctuation

tsd1 = {"the queen": 1, "england": 1, "buckingham palace": 1,
        "some stock": 1, "the painting": 1, "something": 1, "we": 1, "our difference": 1,
        "30 jacket": 1, "the golden age": 1, "many country": 1, "war": 1, "mask": 1,
        "this big snake": 1}
tsd2 = {}
tsd3 = {}
tsd4 = {}
tsd5 = {}


def test_sentence_no_punc():
    pass


def test_blank_pdf():
    docInfo, total_nouns, total_sentences = parsers.run_parsers(
        test_data / 'blank_pdf.pdf')

    csv_name = output_writers.to_csv(
        docInfo, 'totalTimeStr', 'costPerNounStr', total_nouns, 0, 0, test_data / 'blank_pdf.pdf')

    outfile = output / csv_name

    assert len(total_nouns) == 0
    assert outfile.exists() == True

    os.remove(outfile)  # cleanup


def test_accuracy():
    docInfo, total_nouns, total_sentences = parsers.run_parsers(
        test_data / 'test_sentences_10.pdf')

    correct_counts = 0
    extra_counts = 0
    d = {}

    print("---------------------------------------------------------")
    print("Expected:")
    print("---------------------------------------------------------\n")
    {print(x, ", ", tsd1[x]) for x in tsd1}
    print("\n---------------------------------------------------------")

    for noun in total_nouns:
        d[noun.text] = noun.num_occur
        if(noun.text in tsd1):
            correct_counts += 1
        else:
            extra_counts += 1

    print("Actual:")
    print("---------------------------------------------------------\n")
    {print(noun, ", ", occur) for noun, occur, in d.items()}
    print("\n---------------------------------------------------------\n")

    print(str(correct_counts) + '/' + str(len(tsd1)) + " Terms Found")
    print(str(extra_counts) + " False Positives")
    print(str(sum(tsd1.values())) + " Expected Occur")
    print(str(sum(d.values())) + " Actual Occur")

    # print("Total accuracy = " + str(round(correct_counts / sum(d.values()), 2) * 100))


def test_accuracy_():
    # TODO: Mock data in test_data dir

    # nlp = spacy.load('en_core_web_sm')
    # noun_chunks = [[print(c.lemma_) for c in s.noun_chunks] for s in doc.sents]

    docInfo, total_nouns, total_sentences = parsers.run_parsers(
        test_data / 'test_sentences_10.pdf')


def test_info_parsing():
    docInfo, total_nouns, total_sentences = parsers.run_parsers(
        test_data / 'test_paragraph.pdf')

    if docInfo != None:
        print("docInfo working")


def test_sentence_punc():
    docInfo, total_nouns, total_sentences = parsers.run_parsers(
        test_data / 'test_paragraph.pdf')

    if len(total_sentences) == 4:
        print("sentence parsing accurate")
    else:
        print("sentence parsing inaccurate")


def test_invalid_input_extension():
    assert parsers.validate_file(Path('tests/unit_tests.py')) == False


def test_invalid_input_path():
    assert parsers.validate_file(Path('asdfasdfa')) == False


def test_valid_input_pdf():
    assert parsers.validate_file(test_data / 'Game_Genres.pdf') == True


def test_valid_input_docx():
    assert parsers.validate_file(
        test_data / 'Alpha_Prototype_Report_template.docx') == True

# what is this supposed to test?


def test_non_english_input():
    docInfo, total_nouns, total_sentences = parsers.run_parsers(
        test_data / 'non_english_pdf.pdf')

    csv_name = output_writers.to_csv(
        docInfo, 'totalTimeStr', 'costPerNounStr', total_nouns, 0, 0, test_data / 'non_english_pdf.pdf')

    outfile = output / csv_name

    assert outfile.exists() == True
    os.remove(outfile)  # cleanup


def test_existing_database():
    pass


if __name__ == "__main__":
    test_accuracy()
