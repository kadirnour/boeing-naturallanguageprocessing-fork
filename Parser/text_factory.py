import os
from Parser import pdf_extract
from Parser import txt_extract
from Parser import docx_extract

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_text
Description: calls the correct extraction method for different document types
Returns: cleaned token, and booleans for found special characters
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_text(filePath):
    extension = os.path.splitext(filePath)[1]

    if extension == '.pdf':
        file_text = pdf_extract.get_text(filePath)
    elif extension == '.txt':
        file_text = txt_extract.get_text(filePath)
    elif extension == '.docx':
        file_text = docx_extract.get_text(filePath)
    return file_text