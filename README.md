## boeing-naturallanguageprocessing

## Project summary

### One-sentence description of the project

The Boeing Natural Language Processing project aims to innovate our understanding of the world, providing general taxonomy based on the "aboutness".

### Additional information about the project

The taxonomy created by the NLP process has many uses: to translate difficult vocabulary to a general vocabulary, to power the search engines of 
the future and possibly much more.

Our goal for this year is to have a project with a good enough taxonomy to be beleivable. Not so much to have production grade software. This project can
be divided into the following parts:
1. Parse nouns from various file types (PDF currently supported)
2. Gain knowledge and context of each noun
3. Find the frequency and weights of each noun(partially completed)
4. Develop taxonomy based on the weights of each word (goal to arrive at by semesters end)
5. Develop a powerful UI for the front end 

## Installation

### Prerequisites

1. Python 3
2. Git Bash or Powershell
3. Git
4. Currently: 16gb of RAM

### Add-ons

1. BootCat
2. NER Tagger
3. DictionaryAPI.dev

### Installation Steps

Instructions need to be such that a user can just copy/paste the commands to get things set up and running. 
----Option 1----
1. Open the project github page on browser: https://github.com/WSUCptSCapstone-Fall2021Spring2022/boeing-naturallanguageprocessing
2. Open a git bash window
3. Find the file directory you want to clone to: cd directory
4. git clone https://github.com/WSUCptSCapstone-Fall2021Spring2022/boeing-naturallanguageprocessing.git

Note: 'bundle install' not available at this time as the application is still in early stages of developent :(.

----Option 2----
1. Download zip file
2. Extract files into choice directory.

## Functionality

To run the application as is:
1. Download or clone the project into directory using steps above.
2. On a git bash or shell window, go into the boeingnaturalprocessing directory and run command: python3 app.py

## Known Problems

Provide steps to reproduce the problem and/or name a file or a function where the problem lives.
1. Parser is not the most accurate in picking up nouns. To recreate this issue, all that is needed is to run the project like normal and look at the output csv files.
2. Taxonomy creation is innacurate and inneficient. Run the application like normal and observe innacuracy. To see performance open task manager while the program is
running and time the runtime.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Additional Documentation

Sprint Report:
User Link: No user links at this time.

## License

If you haven't already, add a file called `LICENSE.txt` with the text of the appropriate license.
We recommend using the MIT license: <https://choosealicense.com/licenses/mit/>
