import os
from Parser import pdf_extract
from Parser import text_extract
from Parser import docx_extract

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_text
Description: calls the correct extraction method for different document types
Parameters: fi
Returns: cleaned token, and booleans for found special characters
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_text(file_path):
    extension = os.path.splitext(file_path)[1] # input file extension

    if extension == '.pdf':
        file_text = pdf_extract.get_info(file_path)
    elif extension == '.txt':
        file_text = text_extract.get_info(file_path)
    elif extension == '.docx':
        file_text = docx_extract.get_info(file_path)
    return file_text