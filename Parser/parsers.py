'''''''''''''''''''''''''''''''''''''''''''''''''''
file: parser.py

description: handles all methods for parsing the 
document into sentences and nouns
'''''''''''''''''''''''''''''''''''''''''''''''''''

import os
from Parser import noun as Noun
#from noun import Noun
import pdfplumber
import re
import spacy
from docx import Document
from PyPDF2 import PdfFileReader
from Parser import documentInformation
#from documentInformation import DocumentInformation

'''''''''''''''''''''''''''''''''''''''''''''''''''
function: open_pdf

description: opens a pdf using pdfplumber

parameters: fname, the path to the pdf

returns: a pdf object
'''''''''''''''''''''''''''''''''''''''''''''''''''


def open_pdf(file):
    print("Opening " + file.name)

    # check for valid path and extension
    if not file.exists():
        print("File " + file.name + " does not exist. Exiting...")
        exit()
    elif file.suffix != '.pdf':
        print("File " + file.name + " is not a pdf. Exiting...")
        exit()

    # open pdf
    pdf = pdfplumber.open(file)

    return pdf


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: open_doc

description: opens a docx using pdfplumber

parameters: fname, the path to the docx file

returns: 
'''''''''''''''''''''''''''''''''''''''''''''''''''


def open_doc(file):
    print("Opening " + file.name)

    # check for valid path and extension
    if not file.exists():
        print("File " + file.name + " does not exist. Exiting...")
        exit()
    elif file.suffix != '.docx':
        print("File " + file.name + " is not a docx file. Exiting...")
        exit()

    # open docx
    docx = Document(file)

    return docx


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: extract_pdf_text

description: extracts the text from the pdf

parameters: pdf, a pdf object

returns: a list of strings
'''''''''''''''''''''''''''''''''''''''''''''''''''


def extract_pdf_text(pdf):
    page_text = []

    for page in pdf.pages:
        # Skips empty pages MAKE THIS INTO AN EXCEPTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        if (page.extract_text() != None):
            text = page.extract_text().rstrip()
            page_text.append(text)

    return page_text


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: extract_docx_text

description: extracts the text from the pdf

parameters: docx a Document object

returns: a list of strings
'''''''''''''''''''''''''''''''''''''''''''''''''''


def extract_docx_text(docx):
    page_text = []

    for paragraph in docx.paragraphs:
        page_text.append(paragraph.text)

    return page_text


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: validate_file

description: checks that the file_path is valid.

parameters: file_path

returns: true if valid, false otherwise
'''''''''''''''''''''''''''''''''''''''''''''''''''


def validate_file(file):
    # check for valid path
    if not file.exists():
        print("File", file.name, "does not exist. Skipping...")
        return False

    # get the file extension
    extension = file.suffix
    if extension == '.docx' or extension == '.pdf':
        return True
    else:
        print("Unsuported file type", extension, ". Skipping...")
        return False


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: get_sentences

description: parses an array of text into sentences
separated by '.'

parameters: page_text, a list of strings

returns: a list of the Span objects from the spaCy library, 
representing each sentence. 
'''''''''''''''''''''''''''''''''''''''''''''''''''


def get_sentences(page_text):
    total_sentences = []
    nlp = spacy.load('en_core_web_sm')
    for text in page_text:  # go through each page of text

        # parse text
        about_text = nlp(text)
        # store each span (sentence) object in a list
        sentences = list(about_text.sents)

        # append the span objects to the total_sentences list
        for sentence in sentences:
            # quickly cleaning up sentences by removing white space - cleaning method could be improved in future
            sentence_text_copy = sentence.text
            sentence_text_cleaned = sentence_text_copy.lstrip()
            sentence_text_cleaned = sentence_text_cleaned.rstrip()
            if sentence_text_cleaned != "":
                total_sentences.append(sentence)

    return total_sentences


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: get_nouns

description: gets all the nouns within a sentence
and keeps track of the sentences that they are in

parameters: sentences, a list of span objects

returns: a list of noun objects 
'''''''''''''''''''''''''''''''''''''''''''''''''''


def get_nouns(sentences):
    total_nouns = []   # list of noun objects

    for sentence in sentences:

        for token in sentence:
            # Skips over numbers
            if token.like_num:
                continue

            if token.pos_ == 'NOUN' or token.pos_ == 'PROPN':
                # Process noun
                noun_text = token.lemma_  # First take the lemma
                noun_text = noun_text.lower()  # Make it lower case

                # Now determine if this noun has already had an object created for it or not
                found = False
                for noun in total_nouns:
                    if noun.text == noun_text:
                        found = True
                        break

                if found:
                    # if there's an object already, we'll update the object accordingly
                    noun.add_occur(sentence.text.rstrip())
                else:
                    # if not, we'll create a new noun object for it
                    new_noun = Noun.Noun(noun_text, sentence.text.rstrip())
                    total_nouns.append(new_noun)

        # for chunk in sentence.noun_chunks:

        #     #if chunk.like_num: # skips over numbers
        #         #continue

        #     noun_text = chunk.text.lstrip()
        #     noun_text = noun_text.rstrip()
        #     noun_text = noun_text.lower()  # Make it lower case

        #     found = False
        #     for noun in total_nouns:
        #         if noun.text == noun_text:
        #             found = True
        #             break

        #     if found:
        #         # if there's an object already, we'll update the object accordingly
        #         noun.add_occur(sentence.text.rstrip())

        #     else:
        #         # if not, we'll create a new noun object for it
        #         new_noun = Noun.Noun(noun_text, sentence.text.rstrip())
        #         total_nouns.append(new_noun)

    return total_nouns


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: run_parsers

description: parses out all the information from
a file

parameters: file_path

returns: the sentences, info, and nouns from a file 
'''''''''''''''''''''''''''''''''''''''''''''''''''


def run_parsers(file):
    print("Processing file: " + file.name)
    # get the file extension
    extension = file.suffix

    # file types should probably be delegated to some sort of factory method eventually, but this works for now
    if extension == '.pdf':
        # open file
        pdf = open_pdf(file)
        text = extract_pdf_text(pdf)
        docInfo = None

        # get document info
        with file.open('rb') as f:
            reader = PdfFileReader(f)
            # work around for decrpyting file (Checks if decrypted or return exception)
            reader.getNumPages()
            pdfInfo = reader.getDocumentInfo()

        # retrieve attributes from pdf
        docInfo = documentInformation.DocumentInformation(
            pdfInfo.title, pdfInfo.author, str(file.resolve()))
    elif extension == '.docx':
        docx = open_doc(file)
        text = extract_docx_text(docx)
        # can't really extract information dynamically from docx files
        docInfo = documentInformation.DocumentInformation(
            file.name, "", str(file.resolve()))

    # Perform parsing and identification
    # get list of span objects - one for each sentence in pdf file
    total_sentences = get_sentences(text)
    # get list of token (noun) objects
    total_nouns = get_nouns(total_sentences)

    return docInfo, total_nouns, total_sentences

# def get_noun_phrases(sentences, total_nouns):   # use to identify noun phrases containing a particular noun
#     for sentence in sentences:
#         for noun_chunk in sentence.noun_chunks: # for each noun phrase (referred to as "chunks" in spaCy) in the sentence
#             for noun in total_nouns: # find the corresponding noun object
#                 if noun_chunk.root.text == noun.text:
#                     noun.add_phrase(noun_chunk.text.rstrip()) # add the phrase to its noun phrases list
#     return
