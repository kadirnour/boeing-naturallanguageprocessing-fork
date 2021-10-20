#from io import open_code
import os
import csv
#from posix import NGROUPS_MAX


#from documentInformation import DocumentInformation

class Parsing:

   # First thing we need to do is open the csv files to read.
    def extract_frequencies_from_csv():
         
        # dictionary initialize for frequency and weight
        frequency_dict = {}
        
        # gets the path for the output folder boeing/parser/output
        path = os.getcwd() + '\\Parser\\output\\' # Assumes output will be in correctly place

        # then we get the folder from the directory
        folder = os.listdir(path)
        
        # number files for weight calculation
        number_files = len(folder)
        #print(number_files) checking
        for csv_name in folder:
            
            # file path
            file_path = path + '\\' + csv_name

            # open each csv file as read with utf-8
            with open(file_path, 'r', encoding='utf-8') as f:

               # pass in opened file to csv reader and csv delimiter
                rowreader = csv.reader(f, delimiter=',')

                # skip 3 lines with row reader
                next(rowreader)
                next(rowreader)
                next(rowreader)
                
                # Go through each row line by line
                for row in rowreader:
                    

                    # initialize/reset the minidict
                    # minidict = {frequency:x, weight:y}
                    minidict = {}

                    # We get frequency from column 3
                    frequency = int(row[2])

                    # Then we divide frequency by num files to get weight
                    weight = frequency / number_files

                    # check if the word is a duplicate
                    if row[0] in frequency_dict:

                        # dup the update frequency and weight
                        minidict = frequency_dict.get(row[0])
                        #print(minidict)

                        # update the frequency and weight
                        new_frequency = minidict.get("frequency") + frequency
                        new_weight = new_frequency / number_files

                        # and add to the min dict
                        minidict["frequency"] = new_frequency

                        #from here update weight
                        minidict["weight"] = new_weight
                        #print(minidict)

                    else:
                    # Add frequency and weight to minidict
                        minidict["frequency"] = frequency
                        minidict["weight"] = weight

                    # add mini dict to key word
                    # key word is from column 1
                    frequency_dict[row[0]] = minidict
        
        # return the ditionary
        return frequency_dict

    


