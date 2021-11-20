import pdfplumber
from Parser import text_replacer

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_info
Description: gets the text from a .pdf file
Parameters: file location
Returns: list of text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_info(file_path):
    # STEP 1: Get file from file_path
    file = open_pdf(file_path)

    #STEP 2: Get text from file object
    file_text = extract_pdf_text(file)
    return file_text

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: open_pdf
Description: opens .pdf file using pdfplumber
Parameters: file location
Returns: pdf object
'''''''''''''''''''''''''''''''''''''''''''''''''''
def open_pdf(file_path):
    print("Opening " + file_path.name)

    if not file_path.exists(): # file does not exist
        print("File " + file_path.name + " does not exist. Exiting...")
        exit()
    elif not file_path.suffix == ".pdf": # file is not a .pdf
        print("File " + file_path.name + " is not a pdf. Exiting...")
        exit()
    file = pdfplumber.open(file_path) # open pdf with pdfplumber
    return file

'''''''''''''''''''''''''''''''''''''''''''''''''''
function: extract_pdf_text
description: extracts the text from the pdf
parameters: .pdf object
returns: List containing text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def extract_pdf_text(file):

    '''''''''''''''''''''''''''''''''''''''''''''''''''
    function: not_within_bboxes
    description: finds text found in table
    parameters: table object
    returns: text found in table
    '''''''''''''''''''''''''''''''''''''''''''''''''''
    def not_within_bboxes(obj):

        '''''''''''''''''''''''''''''''''''''''''''''''''''
        function: obj_in_bbox
        description: finds table in .pdf
        parameters: .pdf object
        returns: table
        '''''''''''''''''''''''''''''''''''''''''''''''''''
        def obj_in_bbox(_bbox): # Check if the object is in any of the table's bbox.
            v_mid = (obj["top"] + obj["bottom"]) / 2
            h_mid = (obj["x0"] + obj["x1"]) / 2
            x0, top, x1, bottom = _bbox
            return (h_mid >= x0) and (h_mid < x1) and (v_mid >= top) and (v_mid < bottom)
        return not any(obj_in_bbox(__bbox) for __bbox in bboxes)

    file_text = []
    #table_content = ""
    for page in file.pages:
        if (page.extract_text() != None):  # page is not empty (ex. full page image)
            bboxes = [ # defines what a table is in the .pdf
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
            text = page.filter(not_within_bboxes).extract_text().encode('utf-8') # skips text found in table and encodes text into bytes
            text = str(text) # converts bytes back to string
            text = text_replacer.text_replacer(text[: -1]) # replaces special characters

            # !!! REMOVED FOR NOW (VERY INEFFICIENT) !!!
            # try: # finds text in table
            #     tables = page.extract_tables()
            #     for table in tables: # Adds table with each cell as its own sentence
            #         for row in table:
            #             for item in row:
            #                 table_text = item.encode('utf-8')
            #                 table_text = str(table_text)
            #                 table_text = text_replacer.text_replacer(table_text[:-1])
            #                 table_text = table_content.capitalize() # Needs this so spacy knows each sentence is a capital
            #                 table_content += '. ' + table_text + '. ' 
            #     file_text.append(table_content + ".") # Bug where last sentence merges with last cell in table.
            # except:
            #     print("No table found in page")

            file_text.append(text)
    return file_text