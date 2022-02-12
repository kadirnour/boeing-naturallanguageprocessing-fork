import os
import csv

'''''''''''''''''''''''''''''''''''''''''''''''''''
Function: extract_frequencies_from_csv
Description: Finds frequencies and weights of terms
Parameters:
Returns: A dictionary with Key: term, Value: {frequency, weight}
'''''''''''''''''''''''''''''''''''''''''''''''''''
def find_frequencies_and_weights(input, files):
    # STEP 1: Get path and secondary information for calculations
    frequency_dict = {}
    #path = os.getcwd() + '\\Parser\\output\\' # input location
    folder = os.listdir(input) # folder at input location
    #number_files = len(folder) # number of files for weight calculation
    number_files = len(files)
    print(files)

    # STEP 2: Calculate frequencies and weights
    for csv_name in folder:
        print(csv_name)
        file_path = input + '\\' + csv_name 
        data_write = []

        # csv from folder
        with open(file_path, 'r') as r:

            # objects for read and write
            rowreader = csv.reader(r, delimiter=',')
            #writer = csv.writer(w)

            # skip first 3 lines
            data_write.append(next(rowreader))
            data_write.append(next(rowreader))
            data_write.append(next(rowreader))
            print(data_write)

            for row in rowreader:
                #print(row[0])
                minidict = {} # {frequency, weight}
                frequency = int(row[2])
                weight = frequency / number_files # calculate weight of term

                if row[0] in frequency_dict: # term is already in frequency_dict
                    minidict = frequency_dict.get(row[0])
                    new_frequency = minidict.get("frequency") + frequency
                    minidict["frequency"] = new_frequency # update term frequency
                    new_weight = new_frequency / number_files
                    minidict["weight"] = new_weight # update term weight
                    row[2] = new_frequency
                    row.append(new_weight)
                    #print("row: "+str(row))
                    data_write.append(row)
                    #writer.writerow(row)
                else: # term is not already in frequency_dict
                    minidict["frequency"] = frequency
                    minidict["weight"] = weight
                    row.append(weight)
                    #print("row: "+str(row))
                    data_write.append(row)
                    #writer.writerow(row)
                #print(minidict)
                frequency_dict[row[0]] = minidict # update frequency_dict
                
    #print(frequency_dict)
        print(data_write)
        data_writer(data_write,file_path)
        return frequency_dict

def data_writer(data_write, file_path):
    with open(file_path, 'r') as read_obj, \
        open(file_path, 'w', newline='') as write_obj:
        
        # Create a csv.writer object from the output file object
        csv_writer = csv.writer(write_obj)
        
        # Read each row of the input csv file as list
        for row in data_write:
            csv_writer.writerow(row)