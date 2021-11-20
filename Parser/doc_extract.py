import docx
from Parser.text_replacer import text_replacer

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_info
Description: gets the text from a .doc file
Parameters: file location
Returns: list of text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_info(file_path):
    # STEP 1: Get file from file_path
    file = open_doc(file_path)
    
    # STEP 2: Get text from file object
    file_text = extract_doc_text(file)
    return file_text

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: open_doc
Description: Opens .doc file
Parameters: file location
Returns: .doc object
'''''''''''''''''''''''''''''''''''''''''''''''''''
def open_doc(file_path):
    print("Opening " + file_path.name)

    if not file_path.exists(): # file does not exist
        print("File " + file_path.name + " does not exist. Exiting...")
        exit()
    elif not file_path.suffix == ".docx": # file is not type .doc
        print("File " + file_path.name + " is not a doc. Exiting...")
        exit()
    file = docx.Document(file_path) # open .doc
    return file

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: extract_doc_text
Description: Gets the text from .doc file
Parameters: .doc object
Returns: list of text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def extract_doc_text(file):
    file_text = []

    for paragraph in file.paragraphs:
        text = paragraph.text.encode('utf-8')  # converts string to bytes
        text = str(text) # convert bytes back to string
        text = text_replacer(text) # replaces special characters
        file_text.append(text)
    return file_text