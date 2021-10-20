import fpdf
import os

class fpdf:
   
    def convert():
        path = os.getcwd() + '\\Taxonomy\\output\\' # Assumes output will be in correctly place

        response = input('If you used BootCaT, what is the name of your project? (Enter nothing if you didn\'t) ')
        
        path = path + response

        try: 
            folder = os.listdir(path)
        except:
            print("Wrong project name")
    
        for file in folder:

            file_path = path + '\\' + file 

        # pdf = fpdf() 
        # # create or add a page in pdf
        # pdf.add_page() 
        # # set font style and size for text 
        # pdf.set_font('arial', size=10)
        # # create cells and insert text in pdf
        # # left aligned text
        # pdf.cell(200, 10, txt="Line 1 (left aligned)",ln=1,align='L')
        # # center aligned text
        # pdf.cell(200, 10, txt="Line 2 (center aligned)",ln=1,align='C')
        # # right aligned text
        # pdf.cell(200, 10, txt="Line 3 (right aligned)",ln=1,align='R')
        # # save the pdf with any_name.pdf 
        # pdf.output('text_pdf.pdf')


# path = os.getcwd() + '\\Parser\\data' # Gets path from assumed position instead of args

#     folder = os.listdir(path)
 
#     for file in folder:

#             file_path = path + '\\' + file 

#             # parse file
#             docInfo, total_nouns, total_sentences = parsers.run_parsers(file_path)

#             # calculate unique nouns, total nouns
#             unqNouns = len(total_nouns)
#             sumNouns = Noun.calculate_num_nouns_occur(total_nouns)

#             # placeholders for now
#             totalTimeStr = "Total time: Uncomputed"
#             costPerNounStr = "Cost per noun: Uncomputed"
        
#             output_writers.to_csv(docInfo, totalTimeStr, costPerNounStr, total_nouns, unqNouns, sumNouns)