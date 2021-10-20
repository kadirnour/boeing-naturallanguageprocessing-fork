# Project Name
Automated Taxonomy Creation of Boeing Pilot Operating Handbooks

## Project summary
Creation of a service capable of generating Automated Taxonomies using commercially available
services (Google, AWS etc.) and/or open source libraries.

### One-sentence description of the project
From our understanding, we will be using a parser that the last senior project team has made to run on 
pdf's in order to assign and create taxonomies for constrained verticles.

### Additional information about the project
The end goal of the project is to have a program that can be given keywords (like Google's search engine), and with these keywords, be able to point you to related information. This information isn't jjust like-words, but rather it would understand the context of the keywords to give you more useful results. We want to automate this process using ML and AI. 


## Installation

### Prerequisites
1.  Github
2.	Microsoft Visual Studio (With Python Extension Installed)
3.  Python 3.x
4.  attrs==20.3.0
5.  blis==0.7.4
6.  catalogue==2.0.1
7.  certifi==2020.12.5
8.  chardet==4.0.0
9.  click==7.1.2
10. cymem==2.0.5
11. Flask==1.1.2
12. gunicorn==19.9.0
13. idna==2.10
14. iniconfig==1.1.1
15. itsdangerous==1.1.0
16. Jinja2==2.11.3
17. lxml==4.6.3
18. MarkupSafe==1.1.1
19. murmurhash==1.0.5
20. mysql-connector-python==8.0.23
21. mysql-connector-repackaged==0.3.1
22. numpy==1.20.1
23. packaging==20.9
24. pathy==0.4.0
25. pdfminer.six==20200517
26. pdfplumber==0.5.26
27. Pillow==8.1.0
28. pluggy==0.13.1
29. preshed==3.0.5
30. protobuf==3.15.1
31. py==1.10.0
32. pycryptodome==3.10.1
33. pydantic==1.7.3
34. pyparsing==2.4.7
35. PyPDF2==1.26.0
36. pytest==6.2.3
37. python-docx==0.8.10
38. requests==2.25.1
39. six==1.15.0
40. smart-open==3.0.0
41. sortedcontainers==2.3.0
42. spacy==3.0.3
43. spacy-legacy==3.0.1
44. srsly==2.4.0
45. thinc==8.0.1
46. toml==0.10.2
47. tqdm==4.57.0
48. typer==0.3.2
49. urllib3==1.26.3
50. Wand==0.6.5
51. wasabi==0.8.2
52. Werkzeug==1.0.1

### Add-ons
1.	Anaconda Distribution - data science toolkit for ML
2.	PyCharm - python IDE
3.  pdfplumber - plumbs PDFs
4.  spacy - Natual Language Processor
5.  mysql.connector - database
6.  PyPDF2 - PDF library
7.  pytest - testing framework

### Installation Steps
1.  pip install -r requirements.txt
2.  python -m spacy download en_core_web_sm
3.  python3 main.py --file data/document.pdf --database  : runs with the database
4.  python3 main.py --file data/document.pdf : runs without the database
5.  pytest unit_tests.py
6.  pip install pdfplumber
7.  pip install spacy 
8.  python -m spacy download en_core_web_sm
9.  pip install mysql-connector-python
10. pip install PyPDF2
11. pip install pytest
12. Go to https://dev.mysql.com/downloads/
    a.  MySQL Community Server
    b.  MySQL Workbench
    c.  Connector/Python

## Functionality
Click Import and choose Raw text.
Paste:
curl --location --request POST 'http://161.35.254.149/uploads' 
--header 'Content-Type: multipart/form-data; boundary=---011000010111000001101001' 
--form 'file=@"/path/to/file"'
Click continue.
In the main page, look for "Body", it's in between "Headers" and "Pre-request Script", click "Body".
There will be an existing value and a key. Delete the whole line (When you put your cruisor on the line, the right end of the line will have an "X", click on it).
Put your cruisor on top of the key and there will be a "Text" appearing on the right side of the cell.
Click "Text", and change it to file.
Click the first cell of the line, type "file".
In the middle cell of the line, there is a "Select files" button, click on it and choose your pdf file(Just in case it crashes the program with other files, it's set with pdf files only).
Before sending it, go to settings in Postman (Usually it's at the top right).
In General, scroll down and turn on the "Allow reading files outisde working directory".
Now you are all set, click send and wait for the response!
After successfully ran the program on the server, it generates an output.

## Known Problems
No known problems

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Additional Documentation

TODO: Provide links to additional documentation that may exist in the repo, e.g.,
  * Sprint reports
  * User links

## License