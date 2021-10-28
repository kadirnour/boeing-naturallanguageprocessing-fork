import parsers
import noun
import database
import output_writers
import os
from os import path

def test_sentence_no_punc():
    pass

def test_blank_pdf():
    docInfo, total_nouns, total_sentences = parsers.run_parsers('test_data/blank_pdf.pdf')

    csv_name = output_writers.to_csv(docInfo, 'totalTimeStr', 'costPerNounStr', total_nouns, 0, 0)

    assert len(total_nouns) == 0
    assert path.exists(csv_name) == True
    os.remove(csv_name) # cleanup

def test_accuracy():
    correct_noun_counts = {"commercial":1, "aircraft":4, "world":1, "pilot":3, "rule":1, "instance":1, "approach":1,
                            "turn":1, "power":2, "error":1, "problems":1, "maneuvers":1}

    docInfo, total_nouns, total_sentences = parsers.run_parsers('test_data/test_paragraph.pdf')

    correct_counts = 0
    missing_counts = 0
    extra_counts   = 0

    for noun in total_nouns:
        print(noun.text, noun.num_occur)

        # CHECK IF NOUN IN correct_noun_counts
        if noun.text in correct_noun_counts.keys():
            if correct_noun_counts[noun.text] == noun.num_occur:
                correct_counts += noun.num_occur
            else:
                # COUNTED EXTRA
                if correct_noun_counts[noun.text] < noun.num_occur:
                    extra_counts += noun.num_occur - correct_noun_counts[noun.text]
                # MISSED COUNTS
                else:
                    missing_counts += correct_noun_counts[noun.text] - noun.num_occur
        else:
            extra_counts += noun.num_occur

    # print(correct_counts, missing_counts, extra_counts)

    accuracy = round(correct_counts / 18 * 100, 2)
    print("Accuracy:", accuracy)

def test_info_parsing():
    docInfo, total_nouns, total_sentences = parsers.run_parsers('test_data/test_paragraph.pdf')

    if docInfo != None:
        print("docInfo working")

def test_sentence_punc():
    docInfo, total_nouns, total_sentences = parsers.run_parsers('test_data/test_paragraph.pdf')

    if len(total_sentences) == 4:
        print("sentence parsing accurate")
    else:
        print("sentence parsing inaccurate")

def test_invalid_input_extension():
    assert parsers.validate_file('unit_tests.py') == False

def test_invalid_input_path():
    assert parsers.validate_file('asdfasdfa') == False

def test_valid_input_pdf():
    assert parsers.validate_file('data/document.pdf') == True

def test_valid_input_docx():
    assert parsers.validate_file('data/Alpha_Prototype_Report_template.docx') == True

def test_non_english_input():
    docInfo, total_nouns, total_sentences = parsers.run_parsers('test_data/non_english_pdf.pdf')

    csv_name = output_writers.to_csv(docInfo, 'totalTimeStr', 'costPerNounStr', total_nouns, 0, 0)

    assert path.exists(csv_name) == True
    os.remove(csv_name) # cleanup

def test_existing_database():
    pass

# sample tests
def func(x):
    return x + 1

def test_answer():
    assert func(4) == 5
    

