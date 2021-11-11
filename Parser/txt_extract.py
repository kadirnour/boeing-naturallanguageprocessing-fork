from Parser import text_replacer

def extract_txt_text(txt):
    page_text = []

    for line in txt:
        text = line.encode('utf-8') # Converts to bytes
        text = str(text)
        text = text_replacer.text_replacer(text)
        page_text.append(text)

    return page_text

def open_txt(fname):
    print("Opening " + fname.name)

    # check for valid path and extension
    if not fname.exists():
        print("File " + fname.name + " does not exist. Exiting...")
        exit()
    elif not fname.suffix == ".txt":
        print("File " + fname.name + " is not a txt. Exiting...")
        exit()
        
    txt = open(fname, encoding="utf-8")

    return txt



def get_info(file_path):
    # open file
    txt = open_txt(file_path)
    text = extract_txt_text(txt)

    return text