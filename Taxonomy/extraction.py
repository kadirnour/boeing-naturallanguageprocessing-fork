from io import open_code
import os
import csv
from types import new_class

#from documentInformation import DocumentInformation

class Parsing:

    # input location
    input = os.getcwd() + '\\Parser\\output\\'

    ##frequency_dict = {}

   #count initilialize
    doc_count = 0

    dictionary = {}

   # First thing we need to do is open the csv files to read.
    def extract_frequencies_from_csv():
         # dictionary for frequency
        frequency_dict = {}

        # open folder - output folder because 
        # multiple docs multiple output
        for csv_name in os.listdir(input):
            with open(os.open.join(input, csv_name), 'r', new_line='') as f:
            # For each csv file, we extract 
            # from columns A and C grabbing count of 
            # number of docs. Start with A:C
                doc_count = doc_count + 1
                rowreader = csv.reader(csv_name, delimiter=',')
               
               #go through each row
                for row in rowreader:
                    
                    #add key:value to dict from csv
                    frequency_dict[row[0]] = row[2]
        print(frequency_dict)
        return frequency_dict

                


    # We must also combine like terms for frequency between files.
    


