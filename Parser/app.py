import os
from os import path
import time
import argparse
import parsers
import csv
import traceback
import uuid
from flask import (
    Flask,
    redirect,
    request,
    jsonify,
    make_response,
    send_from_directory,
    url_for,
    render_template,
)
from flask.wrappers import Response
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
from PyPDF2 import PdfFileReader

from documentInformation import DocumentInformation


app = Flask(__name__)


DOWNLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__)) + "/downloads/"
app.config["DOWNLOAD_FOLDER"] = DOWNLOAD_FOLDER
UPLOAD_FOLDER = os.path.dirname(os.path.abspath(__file__)) + "/uploads/"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {"pdf","docx"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/downloads/<filename>")
def uploaded_file(filename):
    return send_from_directory(
        app.config["DOWNLOAD_FOLDER"], filename, as_attachment=True
    )


@app.route("/", methods=["GET", "POST"])
def upload():
    print("from upload")
    try:
        if request.method == "POST":
            file = request.files["file"]
            f=file.filename
            if file:
                print(f)
                if file and allowed_file(file.filename):
                    filename = secure_filename(file.filename)
                    # file.save(app.config["UPLOAD_FOLDER"],filename)
                    file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
                    file_path = os.path.join(app.config["UPLOAD_FOLDER"]) + filename
                    print("file_path :",file_path)
                    response = parse_file(filename,file_path)
                    # os.path.join(app.config["UPLOAD_FOLDER"].unlink(filename)
                    os.unlink(app.config["UPLOAD_FOLDER"] + filename)
                    # return jsonify(data=response)
                    return render_template("form.html", data=[response], hasresult=True)
                    # return jsonify(data=response)
                return {"message": "File type  ."+  f.rsplit(".", 1)[1].lower()+" not allowed, try again!", "success": False}
            return {"message": "File   does not exist, try again!", "success": False}
        return render_template("form.html", hasresult=False)
    except Exception as e:
        traceback.print_exc()
        return {"message": str(e), "success": False}



def parse_file(file,file_path):
    try:
        if not file:
            print("File   does not exist. Exiting...")
            # exit()
            return {"message": "File   does not exist. Exiting...", "success": False}

        print("Processing file: " + file)
        startTime = time.time()

         # get the file extension
        extension = file.rsplit(".", 1)[1].lower()
        print("extension : ", extension)
        docInfo = None
        if extension == 'pdf':
        # open file
            pdf = parsers.open_pdf(file_path)
            text = parsers.extract_pdf_text(pdf)
                        # get document info
            with open(file_path, 'rb') as f:
                reader = PdfFileReader(f)
                reader.getNumPages() # work around for decrpyting file
                pdfInfo = reader.getDocumentInfo()

            # retrieve attributes from pdf
            docInfo = DocumentInformation(pdfInfo.title, pdfInfo.author, file_path)
        elif extension == 'docx':
            docx = parsers.open_doc(file_path)
            text = parsers.extract_docx_text(docx)
            # can't really extract information dynamically
            docInfo = DocumentInformation( file.rsplit(".", 1)[0].lower(),"_",file_path)
        else:
            print("unsuported file type", extension, "skipping")
            # continue
            return {"message": "unsuported file type" + extension +"skipping", "success": False}

        # Perform parsing and identification
        total_sentences = parsers.get_sentences(text)  # get list of span objects - one for each sentence in pdf file
        total_nouns = parsers.get_nouns(total_sentences)   # get list of token (noun) objects
        parsers.get_noun_phrases(total_sentences, total_nouns)   # find noun phrases

        # end timer
        elapsedTime = time.time() - startTime
        totalTimeStr = "Total time: " + str(round(elapsedTime, 3)) + " sec" # used in .csv file

        # calculate unique nouns, total nouns
        unqNouns = len(total_nouns)
        sumNouns = 0       
        for noun in total_nouns:
            sumNouns += noun.num_occur
         # calculate cost per noun in milliseconds
        costPerNoun = (elapsedTime * 1000) / sumNouns
        costPerNounStr = "Cost per noun: " + str(round(costPerNoun, 3)) + " ms" # used in .csv file
    
        # Open csv files to write to
        if docInfo.document_name != None:
            csv_name = docInfo.document_name + '_nouns.csv'
        else:
            csv_name = (file_path.split('/'))[-1][:-4] + '_nouns.csv' # get name of file from file_path (removes ".pdf" too)
        path = "downloads/"

        with open(path+csv_name, 'w', newline='') as csvfile:
            nounwriter = csv.writer(csvfile)
            nounwriter.writerow([docInfo.document_name, docInfo.authors]) # can add more attributes too
            nounwriter.writerow(["Unique nouns: " + str(unqNouns), " Total nouns: " + str(sumNouns)])
            nounwriter.writerow([totalTimeStr, costPerNounStr])
            for noun in total_nouns:
                nounwriter.writerow([noun.text, noun.context_sentences, noun.noun_phrases, noun.num_occur])
            print('Data has been successfully saved to ' + csv_name)

        print(request.host_url)
        response = request.host_url + path + csv_name
        return {"downloadlink": response, "success": True}
    except Exception as e:
        traceback.print_exc()
        return {"message": str(e), "success": False}


if __name__ == "__main__":
    # manager.run()
    app.run(host="0.0.0.0", debug=False)
