from os import path
import pdfplumber
from PyPDF2 import PdfFileReader
from Parser import documentInformation

'''''''''''''''''''''''''''''''''''''''''''''''''''
function: open_pdf

description: opens a pdf using pdfplumber

parameters: fname, the path to the pdf

returns: a pdf object
'''''''''''''''''''''''''''''''''''''''''''''''''''

def open_pdf(fname):
    print("Opening " + fname)

    # check for valid path and extension
    if not path.exists(fname):
        print("File " + fname + " does not exist. Exiting...")
        exit()
    elif not fname.endswith('.pdf'):
        print("File " + fname + " is not a pdf. Exiting...")
        exit()

    # open pdf
    pdf = pdfplumber.open(fname)

    return pdf


'''''''''''''''''''''''''''''''''''''''''''''''''''
function: extract_pdf_text

description: extracts the text from the pdf

parameters: pdf, a pdf object

returns: a list of strings
'''''''''''''''''''''''''''''''''''''''''''''''''''

def extract_pdf_text(pdf):
    page_text = []

    for page in pdf.pages:
        if (page.extract_text() != None):  # Skips empty pages MAKE THIS INTO AN EXCEPTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            text = page.extract_text().rstrip()
            page_text.append(text)

    return page_text




def get_info(file_path):
    # open file
    pdf = open_pdf(file_path)
    text = extract_pdf_text(pdf)
    docInfo = None

    # get document info
    with open(file_path, 'rb') as f:
        reader = PdfFileReader(f)
        # work around for decrpyting file (Checks if decrypted or return exception)
        reader.getNumPages()
        pdfInfo = reader.getDocumentInfo()

    # retrieve attributes from pdf
    docInfo = documentInformation.DocumentInformation(
        pdfInfo.title, pdfInfo.author, file_path)

    return text, docInfo
