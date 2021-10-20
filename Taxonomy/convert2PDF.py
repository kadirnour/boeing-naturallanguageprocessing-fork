from fpdf import FPDF
import os

class fpdf:
   
    # Converts .txt from BootCaT to .pdf to be used by parser
    def convert():
        while True:
            path = os.getcwd() + '\\Taxonomy\\extra_data\\' # Assumes output will be in correctly place
            response = input('If you used BootCaT, what is the corpus name (name of folder in extra_data)? (Enter \'C\' to cancel) ')
            path = path + response + '\\corpus'
            folder = ''

            if (response.lower() == 'c'):
                break

            try: # Checks if the corpus name is correct
                folder = os.listdir(path)
            except:
                print("wrong corpus name")

            if folder != '': 
                for file in folder: # Gets every .txt file and converts it into a .pdf
                    file_path = path + '\\' + file 
                    pdf = FPDF()
                    pdf.add_page()
                    pdf.add_font('Arial', '', 'c:/windows/fonts/arial.ttf', uni=True)
                    pdf.set_font("Arial", size = 10)
                    text_file = open(file_path, 'r')
                    #, encoding='utf-8')

                    for text in text_file:
                        pdf.cell(200, 10, txt=text, ln=1, align='L')

                    pdf.output(os.getcwd() + '\\Parser\\data\\' + (file.split('/'))[-1][:-4] + '.pdf', 'F') # Changes doc name (shouldn't matter) and saves it to Parser\data
                    #.encode('utf-8')
                break