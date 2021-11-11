import docx
from pathlib import Path as p
from Parser.text_replacer import text_replacer


def open_docx(fname):
    print("Opening " + fname.name)

    # check for valid path and extension
    if not fname.exists():
        print("File " + fname.name + " does not exist. Exiting...")
        exit()
    elif not fname.suffix == ".docx":
        print("File " + fname.name + " is not a docx. Exiting...")
        exit()

    # open pdf with pdfplumber
    txt = docx.Document(fname)

    return txt


def extract_doc_text(doc):
    page_text = []

    for line in doc.paragraphs:

        text = line.text.encode('utf-8')  # Converts to bytes
        text = str(text)
        text = text_replacer(text)

        page_text.append(text)

    return page_text


def get_info(file_path):
    # open file
    txt = open_docx(file_path)
    text = extract_doc_text(txt)

    return text
