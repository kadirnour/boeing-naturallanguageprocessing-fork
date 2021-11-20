import docx
from Parser.text_replacer import text_replacer

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_info
Description: gets the text from a .docx file
Parameters: file location
Returns: list of text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_info(file_path):
    # STEP 1: Get file from file_path
    file = open_docx(file_path)
    
    # STEP 2: Get text from file object
    file_text = extract_docx_text(file)
    return file_text

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: open_doc
Description: Opens .doc file
Parameters: file location
Returns: .doc object
'''''''''''''''''''''''''''''''''''''''''''''''''''
def open_docx(file_path):
    print("Opening " + file_path.name)

    if not file_path.exists(): # file does not exist
        print("File " + file_path.name + " does not exist. Exiting...")
        exit()
    elif not file_path.suffix == ".docx": # file is not type .docx
        print("File " + file_path.name + " is not a doc. Exiting...")
        exit()
    file = docx.Document(file_path) # open .docx
    return file

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: extract_docx_text
Description: Gets the text from .docx file
Parameters: .docx object
Returns: list of text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def extract_docx_text(file):
    file_text = []

    for paragraph in file.paragraphs:
        text = paragraph.text.encode('utf-8')  # converts string to bytes
        text = str(text) # convert bytes back to string
        text = text_replacer(text[: -1]) # replaces special characters
        file_text.append(text)
    return file_text