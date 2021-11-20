from Parser import noun as Noun
import re
import spacy
from Parser import text_replacer

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: run_parsers
Description: gets nouns and noun phrases from text
Parameters: list containing text
Returns: list of noun objects (noun and sentence)
'''''''''''''''''''''''''''''''''''''''''''''''''''
def run_parsers(text):
    # STEP 1: Get sentences from text
    total_sentences = get_sentences(text)

    # STEP 2: Get noun objects from sentences
    total_nouns = get_nouns(total_sentences)
    return total_nouns

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_sentences
Description: gets sentences from text
Parameters: list containing text
Returns: a list of the Span objects from the spaCy library, representing each sentence. 
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_sentences(text):
    total_sentences = ""
    nlp = spacy.load('en_core_web_sm')
    print("Getting sentences from file...")

    for page in text:
        page_text_cleaned = re.sub(' +', ' ', page) # removes extra spaces
        total_sentences += page_text_cleaned
    total_sentences = nlp(total_sentences) # converts sentences into NLP span objects
    total_sentences = list(total_sentences.sents) # converts span objects into a list of span objects
    return total_sentences

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_nouns
Description: gets nouns and noun phrases and the sentences they belong to
Parameters: list of NLP span objects (sentences)
Returns: a list of noun objects 
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_nouns(total_sentences):
    print("Getting nouns and noun chunks from sentences...")
    total_nouns = []
    nlp = spacy.load('en_core_web_sm')

    for sentence in total_sentences:
        foundDash = False
        foundSlash = False
        lower_sentence = sentence.text.lower() # lower cases sentence (!!! LOSES FIRST NAME, ONLY GETS LAST NAME !!!)
        lower_sentence = nlp(lower_sentence) # creates nlp object from lower case sentence

        for chunk in lower_sentence.noun_chunks: # finds nouns and noun chunks from lower case sentence
            noun_chunk = ""
            found = False

            for token in chunk:
                noun, foundDash, foundSlash = text_replacer.token_replacer(token, foundDash, foundSlash) # removes extra spaces in front and behind of dash/ slash
                noun_chunk += noun
            cleaned_noun_chunk = noun_chunk.lstrip().rstrip() # removes extra spaces

            for noun in total_nouns: # check if chunk is already in total_nouns
                if cleaned_noun_chunk == noun.text: # chunk is already in total_nouns
                    noun.add_occur(sentence.text) # add original sentence to noun object
                    found = True
                    break
            if not found: # chunk is not already in total_nouns
                new_noun = Noun.Noun(cleaned_noun_chunk, sentence.text) # create a new noun object
                total_nouns.append(new_noun)
    return total_nouns