from Parser import text_replacer

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_info
Description: gets the text from a .txt file
Parameters: file location
Returns: list containing text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_info(file_path):
    # STEP 1: Get file from file_path
    file = open_txt(file_path)

    # STEP 2: Get text from file object
    file_text = extract_txt_text(file)
    return file_text

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: extract_txt_text
Description: extracts text from .txt file
Parameters: .txt object
Returns: List containing text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def extract_txt_text(file):
    file_text = []

    for line in file:
        text = line.encode('utf-8') # converts string to bytes
        text = str(text) # converts bytes back to string
        text = text_replacer.text_replacer(text) # replaces special characters
        file_text.append(text[:-1])
    return file_text

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: open_txt
Description: opens the .txt file
Parameters: file location
Returns: txt object
'''''''''''''''''''''''''''''''''''''''''''''''''''
def open_txt(file_path):
    print("Opening " + file_path.name)

    if not file_path.exists(): # file location does not exist
        print("File " + file_path.name + " does not exist. Exiting...")
        exit()
    elif not file_path.suffix == ".txt": # file is not .txt
        print("File " + file_path.name + " is not a txt. Exiting...")
        exit()
    file = open(file_path, encoding="utf-8")
    return file