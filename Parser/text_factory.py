import os
from Parser import pdf_extract
from Parser import txt_extract
from Parser import doc_extract


def get_text(file_path):

    # get the file extension
    extension = os.path.splitext(file_path)[1]

    # file types should probably be delegated to some sort of factory method eventually, but this works for now
    if extension == '.pdf':
        text = pdf_extract.get_info(file_path)
    elif extension == '.txt':
        text = txt_extract.get_info(file_path)
    elif extension == '.docx':
        text = doc_extract.get_info(file_path)

    return text
