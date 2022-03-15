'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: replace_text
Description: checks the given text for special character exceptions and cleans them
Returns: cleaned text
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def replace_text(text):
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
    if text.find("\\xef\\xa3\\xa9") != -1:
        text = text.replace("\\xef\\xa3\\xa9", "")
    if text.find("\\xe2\\x80\\x98") != -1:
        text = text.replace("\\xe2\\x80\\x98", "'")
    if text.find("\\xe2\\x80\\x93") != -1:
        text = text.replace("\\xe2\\x80\\x93", "-")
    if text.find("\\xe2\\x80\\x94") != -1:
        text = text.replace("\\xe2\\x80\\x94", "-")
    if text.find("\\xe2\\x80\\xa2") != -1:
        text = text.replace("\\xe2\\x80\\xa2", "")
    return text


'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Function: token_replacer
Description: removes extra spaces created when parsing tokens
Returns: cleaned token, and booleans for found special characters
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def token_replacer(token, foundDash, foundSlash):
    if token.text != "(":     
        if ("'s" == token.text):
            return token.text, False, False
        elif ("," == token.text):
            return token.text, False, False
        elif ("-" == token.text):
            return token.text, True, False
        elif ("/" == token.text):
            return token.text, False, True
        elif (foundDash == True):
            return token.text, False, False
        elif (foundSlash == True):
            return token.text, False, False
        else:
            return " " + token.lemma_, False, False
    else:
        return "", False, False