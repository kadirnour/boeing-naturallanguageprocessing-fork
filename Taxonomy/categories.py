import csv
import os

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
def receive_categories(input):
    print(input)
    return input
    #taxDict = process_taxonomy(input)
    #taxonomy_writer(taxDict)


'''
Method: process_taxonomy
Input: {categories:{terms:weights}}
Output: {Category:Weight},{terms:weights}
Description:
'''
def process_taxonomy(input):
    taxList=[]
    taxWeight = 0
    for category,terms in input.items():
        #print(terms)
        taxWeight=calculate_taxonomy(terms)
        #print(taxWeight)
        taxVal = {category:taxWeight}
        taxi = (taxVal,terms)
        taxList.append(taxi)
    return taxList

'''
Method: calculate_taxonomy
Input: categories:{terms:weights}
Output: taxWeight
Description: adds up the category weight of each term
'''
def calculate_taxonomy(terms):
    taxWeight = 0
    #print(input.values())
    for term, weight in terms.items():
        #print(weight)
        taxWeight = weight + taxWeight
    return taxWeight

'''
Method: taxonomy_writer
Input: {Category:Weight}:{Terms:Weights}
Output: A CSV file with: 
Description: 
'''
def taxonomy_writer(input):
    output = ""
    with open(output, 'w') as out:
        writer = csv.writer(out)
        for taxonomy,terms in input:
            for category,weight in taxonomy.items():
                writer.writerow([category,weight,terms])