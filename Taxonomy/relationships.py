import csv
import os

def saveRelationships(folder, edges, nodes, relationshipTypes):
    file = folder + '\\' + 'relationships.csv' # csv from folder
    
    data_write = []
    data_write.append(edges)
    data_write.append(nodes)
    data_write.append(relationshipTypes)

    data_writer(data_write, file)


def data_writer(data_write, file_path):
    with open(file_path, 'w', newline='') as write_obj:
        
        # Create a csv.writer object from the output file object
        csv_writer = csv.writer(write_obj)
        
        # Read each row of the input csv file as list
        for row in data_write:
            csv_writer.writerow(row)