import csv
from csv import writer
from csv import reader
import os
#import pandas

'''
File Task:
Input: Categories and their terms:weights s.a. 
{categories:{terms:weights}}
Output: CSV file with the following:
Category    Cat_Weight      Terms or Terms:Weights

Big Questions:
# 1) What will the input data structure actually be?
# 2) Must we retain term weights
'''

'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Method: receive_categories(input, output?)
Input: Categories and their terms:weights s.a. 
{categories:{terms:weights}}
Output: None
Description: 
A master method that:
1) Takes input dictionary and passes into a calculation helper
2) The taxonomy calculator will return one of the following:
    Tax weight itself
    {Category:Weight}:[Terms]
Then passes result to tax_writer
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
def receive_categories(folder, categoryDict):
    print(folder)
    print(categoryDict)
    # input: {categories:{terms:{freq:#, weight:#}}}}
    # Output: 
    taxDict = process_taxonomy(categoryDict)
    print(taxDict)
    taxonomy_writer(folder, taxDict)


'''
Method: process_taxonomy
Input: {categories:{terms:{freq:#, weight:#}}}}
Output: {Category}:[terms]
Description:
'''
def process_taxonomy(input):
    taxDict = {}
    for category,terms in input.items():
        termList = {}
        for term,values in terms.items():
            termList[term]=values['weight']
        taxDict[category] = termList
    return taxDict

'''
Method: calculate_taxonomy
Input: categories:{terms:weights}
Output: taxWeight
Description: adds up the category weight of each term

def calculate_taxonomy(terms):
    taxWeight = 0
    #print(input.values())
    for term, weight in terms.items():
        #print(weight)
        taxWeight = weight + taxWeight
    return taxWeight
'''

'''
TODO
Method: taxonomy_writer
Input: {Category:Weight}:{Terms}
Output: A CSV file with: 
Description: 
'''
def taxonomy_writer(foldr, taxDict):
    folder = os.listdir(foldr) # folder at input location
    print(folder)
    for csv_name in folder:
        file = foldr + '\\' + csv_name # csv from folder
        """ Append a column in existing csv using csv.reader / csv.writer classes"""
        # Open the input_file in read mode and output_file in write mode
        with open(file, 'r') as read_obj, \
            open(file, 'a', newline='') as write_obj:
            # Create a csv.reader object from the input file object
            csv_reader = reader(read_obj)
            # Create a csv.writer object from the output file object
            csv_writer = writer(write_obj)
            #Skip 3 lines
            next(csv_reader)
            next(csv_reader)
            next(csv_reader)
            # Read each row of the input csv file as list
            for row in csv_reader:
                print(row)
                for category,terms in taxDict.items():
                    for term,weight in terms.items():
                        if row[0]==term:
                            # Append the default text in the row / list
                            #row.append(weight)
                            row.append(category)
                        # Write the updated row / list to the output file
                            csv_writer.writerow(row)
        
        
        
        
        
        
        
        
        
        
        
        
        '''
        with open(file, 'r+',  encoding='utf-8') as out:
          
         # writer = csv.writer(out)
          rowreader = csv.reader(out, delimiter=',')
          next(rowreader) # skip first 3 lines
          next(rowreader)
          next(rowreader)
          for row in rowreader:
             termToMatch = row[0]
             for category,terms in taxDict.items():
                for term,weight in terms.items():
                    if term == termToMatch:
                                            
                        print(row[4])
                        #row.append(weight)
        '''

        '''
        with open(file, 'w',newline="") as f: # output csv file
            writer = csv.writer(f)
            with open(file,'r') as csvfile: # input csv file
                reader = csv.reader(csvfile, delimiter=',')
                next(reader)
                next(reader)
                next(reader)
                for row in reader:  
                    row[3] = f1.readline() # edit the 8th column 
                    writer.writerow(row)
        f1.close()  
        
        
        

    #return 0
    '''