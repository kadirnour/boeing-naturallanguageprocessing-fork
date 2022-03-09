from Data import text_replacer

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: get_text
Description: gets text from .txt
Returns: text from .txt
'''''''''''''''''''''''''''''''''''''''''''''''''''
def get_text(filePath):
    file = open_file(filePath)
    fileText = extract_txt_text(file)
    return fileText

    
'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: open_file
Description: opens the .txt
Returns: .txt object
'''''''''''''''''''''''''''''''''''''''''''''''''''
def open_file(filePath):
    if not filePath.exists():
        print("File " + filePath.name + " does not exist. Exiting...")
        exit()
    elif not filePath.suffix == ".txt":
        print("File " + filePath.name + " is not a txt. Exiting...")
        exit()

    file = open(filePath, encoding="utf-8")
    return file


'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: extract_txt_text
Description: extracts text from .txt
Returns: List containing text
'''''''''''''''''''''''''''''''''''''''''''''''''''
def extract_txt_text(file):
    fileText = []
    for line in file:
        text = line.encode('utf-8')
        text = str(text)
        text = text_replacer.replace_text(text)
        fileText.append(text[:-1])
    return fileText

