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
    print("Opening " + fname.name)

    # check for valid path and extension
    if not fname.exists():
        print("File " + fname.name + " does not exist. Exiting...")
        exit()
    elif not fname.suffix == ".pdf":
        print("File " + fname.name + " is not a pdf. Exiting...")
        exit()

    # open pdf with pdfplumber
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
            text = page.extract_text().encode('utf-8') # Converts to bytes
            #print(text)
            text = str(text) # Converts back to string
            text = (text.replace("\\xe2\\x80\\x99", "'").replace("\\xe2\\x80\\x9c", "\"").replace("\\xe2\\x80\\x9d","\""))
            #.replace("b'", "").lstrip().rstrip()) # Replaces hex code with correct ascii !!!!!!!!!!!!!! Change this to case structure
            
            # print(text.decode('utf-8'))

            page_text.append(text)

    print(page_text)

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
