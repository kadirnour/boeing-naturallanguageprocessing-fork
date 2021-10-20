import pikepdf
import argparse
import os
import sys

# Need to run this once to unencrypt pdfs

def dir_path(path):
    if os.path.isdir(path):
        return path
    else:
        raise argparse.ArgumentTypeError(f"readable_dir:{path} is not a valid path")

def parse_args(args):
    parser = argparse.ArgumentParser()
    parser.add_argument('--path', '-f', type=dir_path, required=True, nargs='+', help='path of folder to parse')
    return parser.parse_args()

def main():
    path = parse_args(sys.argv).path[0]

    folder = os.listdir(path)
 
    for file in folder:
        file_path = path + '\\' + file 

        pdf = pikepdf.open(file_path, allow_overwriting_input=True) # Copies the pdf as an unencrypted pdf and overwrites original
        pdf.save(file_path)


if __name__ == "__main__":
    main()