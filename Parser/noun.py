class Noun: # noun object created when finding nouns and noun phrases

    '''''''''''''''''''''''''''''''''''''''''''''''''''
    function: __init__
    description: Creates a new noun object
    parameters: Noun or noun phrase. Sentence the noun or noun phrase is found in.
    returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''
    def __init__(self, text, context_sentence):
        self.text = text   # noun as a string
        self.context_sentences = [context_sentence]   # list of sentence strings, one for each sentence the noun appears in
        self.num_occur = 1   # number of times the noun has appeared

    '''''''''''''''''''''''''''''''''''''''''''''''''''
    function: add_occur
    description: Add to the noun object the sentence the noun or noun phrase is found in
    parameters: Sentence noun or noun phrase is found in
    returns:
    '''''''''''''''''''''''''''''''''''''''''''''''''''
    def add_occur(self, context_sentence):
        self.num_occur += 1

        if context_sentence not in self.context_sentences:   # sentence has not already been added to noun object
            self.context_sentences.append(context_sentence)

'''''''''''''''''''''''''''''''''''''''''''''''''''
function: calculate_num_nouns_occur
description: Calculates the total number of nouns or noun phrases found
parameters: List of nouns and noun phrases
returns: number of occurances of the noun or noun phrase
'''''''''''''''''''''''''''''''''''''''''''''''''''
def calculate_num_nouns_occur(nouns):
    sumNouns = 0  

    for noun in nouns:
        sumNouns += noun.num_occur
    return sumNouns