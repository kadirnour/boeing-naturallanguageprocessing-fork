from Parser import noun as Noun
import re
import spacy
from Parser import text_replacer

'''''''''''''''''''''''''''''''''''''''''''''''''''
function: get_sentences

description: parses an array of text into sentences
separated by '.'

parameters: page_text, a list of strings

returns: a list of the Span objects from the spaCy library, 
representing each sentence. 
'''''''''''''''''''''''''''''''''''''''''''''''''''

def get_sentences(page_text):
    print("Getting sentences from file...")
    total_sentences = []
    nlp = spacy.load('en_core_web_sm')
    for text in page_text:  # go through each page of text

        # parse text
        about_text = nlp(text)
        # store each span (sentence) object in a list
        sentences = list(about_text.sents)

        # append the span objects to the total_sentences list
        for sentence in sentences: 
            sentence_text_cleaned = re.sub(' +', ' ', sentence.text) # Gets rid of extra spaces

            if sentence_text_cleaned != "":
                total_sentences.append(sentence_text_cleaned) # Cleans string and converts from Span to string.
    
    #print(total_sentences)

    cleaned_total_sentences = " ".join(total_sentences) # Creates one big setence
    test = nlp(cleaned_total_sentences)
    test_sentences = list(test.sents)
    result = []

    for sentence in test_sentences:
        result.append(sentence)

    return result

'''''''''''''''''''''''''''''''''''''''''''''''''''
function: get_nouns

description: gets all the nouns within a sentence
and keeps track of the sentences that they are in

parameters: sentences, a list of span objects

returns: a list of noun objects 
'''''''''''''''''''''''''''''''''''''''''''''''''''

def get_nouns(sentences):
    print("Getting nouns and noun chunks from sentences...")
    total_nouns = []   # list of noun objects

    for sentence in sentences:
        foundDash = False
        for chunk in sentence.noun_chunks:
            noun_chunk = ""
            for token in chunk:
                noun, foundDash = text_replacer.token_replacer(token, foundDash)
                noun_chunk += noun
                
            noun_chunk = noun_chunk.lstrip().rstrip().lower()
            found = False

            for noun in total_nouns: # Checks through current nouns
                if noun_chunk == noun.text:# or noun.text == noun_chunk: # Checks if chunk is already in current nouns
                    found = True
                    break
            if found:
                # if there's an object already, we'll update the object accordingly
                noun.add_occur(sentence.text.rstrip())
            else:
                # if not, we'll create a new noun object for it
                new_noun = Noun.Noun(noun_chunk, sentence.text.rstrip().lstrip())
                total_nouns.append(new_noun)

    return total_nouns


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: run_parsers

description: parses out all the information from
a file

parameters: file_path

returns: the sentences, info, and nouns from a file 
'''''''''''''''''''''''''''''''''''''''''''''''''''

def run_parsers(text):
    total_sentences = get_sentences(text)
    total_nouns = get_nouns(total_sentences)

    return total_nouns, total_sentences