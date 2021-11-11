import pdfplumber
from Parser import text_replacer

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

    def not_within_bboxes(obj):
    #"""Check if the object is in any of the table's bbox."""

        def obj_in_bbox(_bbox):
            #"""See https://github.com/jsvine/pdfplumber/blob/stable/pdfplumber/table.py#L404"""
            v_mid = (obj["top"] + obj["bottom"]) / 2
            h_mid = (obj["x0"] + obj["x1"]) / 2
            x0, top, x1, bottom = _bbox
            return (h_mid >= x0) and (h_mid < x1) and (v_mid >= top) and (v_mid < bottom)

        return not any(obj_in_bbox(__bbox) for __bbox in bboxes)

    page_text = []
    table_content = ""

    for page in pdf.pages:
        if (page.extract_text() != None):  # Skips empty pages MAKE THIS INTO AN EXCEPTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            
            try:
                bboxes = [
                    table.bbox
                    for table in page.find_tables(
                        table_settings={
                            "vertical_strategy": "explicit",
                            "horizontal_strategy": "explicit",
                            "explicit_vertical_lines": page.curves + page.edges,
                            "explicit_horizontal_lines": page.curves + page.edges,
                        }
                    )
                ]
            except:
                print("TABLE ERROR")

            text = page.filter(not_within_bboxes).extract_text().encode('utf-8') # Skips tables
            text = str(text) # Converts back to string
            text = text_replacer.text_replacer(text[:-1]) # Gets rid of leading 'b and following '

            try:
                tables = page.extract_tables()

                for table in tables: # Adds table with each cell as its own sentence
                    for row in table:
                        for item in row:
                            table_text = item.encode('utf-8')
                            table_text = str(table_text)
                            table_text = text_replacer.text_replacer(table_text[:-1])
                            table_text = table_content.capitalize() # Needs this so spacy knows each sentence is a capital
                            table_content += '. ' + table_text + '. ' 
                page_text.append(table_content + ".") # Bug where last sentence merges with last cell in table.
            except:
                print("TABLE ERROR")

            page_text.append(text)

    return page_text

def get_info(file_path):
    # open file
    pdf = open_pdf(file_path)
    text = extract_pdf_text(pdf)

    return text
