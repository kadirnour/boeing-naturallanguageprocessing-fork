'''''''''''''''''''''''''''''''''''''''''''''''
function: text_replacer

description: checks the strng for bytes and cleans from text

parameters: text to be checked

returns: cleaned text

TODO: find alternative to if statements

'''''''''''''''''''''''''''''''''''''''''''''''

def text_replacer(text):

    if text.find("\\xe2\\x80\\x99") != -1:
        text = text.replace("\\xe2\\x80\\x99", "'")

    if text.find("\\xe2\\x80\\x9c") != -1:
        text = text.replace("\\xe2\\x80\\x9c", "\"")

    if text.find("\\xe2\\x80\\x90") != -1:
        text = text.replace("\\xe2\\x80\\x90", "-")

    if text.find("\\xe2\\x80\\xa6") != -1:
        text = text.replace("\\xe2\\x80\\xa6", "...")

    if text.find("\\xe2\\x80\\x9d") != -1:
        text = text.replace("\\xe2\\x80\\x9d", "\"")

    if text.find("\\'") != -1:
        text = text.replace("\\'", "'")

    if text.find("b'") != -1:
        text = text.replace("b'", "")

    if text.find('\\n') != -1:
        text = text.replace('\\n', '')

    if text.find("b\"") != -1:
        text = text.replace("b\"", "")

    return text

def token_replacer(token, foundDash):
    if token.text != "(": # Exception handler for ( !!!!!!!!!!!!!!!!!!!!!!!MAYBE WE DO BETTER         
        if ("'s" == token.text): # Exception handling a word followed by 's creates a unneccesary space, this deletes the space !!!! NEED TO TEST FOR THINGS OTHER THEN 's
            return token.text, False

        elif ("," == token.text):
            return token.text, False

        elif ("-" == token.text):
            return token.text, True

        elif (foundDash == True):
            return token.text, False

        else:
            return " " + token.lemma_, False
    else:
        return "", False