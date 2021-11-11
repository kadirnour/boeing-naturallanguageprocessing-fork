from nltk.stem.wordnet import WordNetLemmatizer
from Parser import noun as Noun
import nltk
from Parser import pdf_extract

def run_parsers(file_path):
    print("Processing file: " + file_path)

    text, docInfo = pdf_extract.get_info(file_path)

    # Perform parsing and identification
    # get list of span objects - one for each sentence in pdf file
    total_sentences = get_sentences(text)
    
    # get list of token (noun) objects
    total_nouns = get_nouns(total_sentences)

    return docInfo, total_nouns, total_sentences

from nltk.tokenize import sent_tokenize

def get_sentences(page_text):
    total_sentences = []

    for page in page_text:
        sentences = sent_tokenize(page)

        for sentence in sentences:
            total_sentences.append(" ".join(sentence.split()))

    return total_sentences

def get_nouns(total_sentences):
    total_nouns = []   # list of noun objects
    wnl = WordNetLemmatizer()

    for sentence in total_sentences:
        tokens = nltk.word_tokenize(sentence)
        tagged = nltk.pos_tag(tokens)

        for word in tagged:
            if "NN" in word[1]:
                word = wnl.lemmatize(word[0])
                word = word.lower()
                found = False

                for noun in total_nouns:
                    if noun.text == word:
                        found = True
                        break

                if found:
                    # if there's an object already, we'll update the object accordingly
                    noun.add_occur(sentence)
                else:
                    # if not, we'll create a new noun object for it
                    new_noun = Noun.Noun(word, sentence)
                    total_nouns.append(new_noun)
    
    return total_nouns
