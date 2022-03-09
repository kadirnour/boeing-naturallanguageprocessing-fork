'''''''''''''''''''''''''''''''''''''''''''''''''''
function: Noun
description: Noun object
'''''''''''''''''''''''''''''''''''''''''''''''''''
class Noun:

    '''''''''''''''''''''''''''''''''''''''''''''''''''
    function: __init__
    description: creates a new noun object
    '''''''''''''''''''''''''''''''''''''''''''''''''''
    def __init__(self, text, contextSentence):
        self.occurances = 1
        self.text = text
        self.contextSentences = [contextSentence]


    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    function: add_occurance
    description: add to the noun object the sentence the noun or noun phrase is found in
    '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
    def add_occurance(self, contextSentence):
        self.occurances += 1
        if contextSentence not in self.contextSentences: # sentence has not already been added to noun object
            self.contextSentences.append(contextSentence)


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
function: get_total_nouns
description: calculates the total number of nouns or noun phrases found
returns: number of occurances of the noun or noun phrase
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def get_total_nouns(nouns):
    sumNouns = 0  
    for noun in nouns:
        sumNouns += noun.occurances
    return sumNouns