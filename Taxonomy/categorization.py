from nltk.tag import StanfordNERTagger as NER
import os
import requests

home = os.path.expanduser("~")
url = "https://api.dictionaryapi.dev/api/v2/entries/en/"


class categorization:

    def term_categorization(terms):
        cat = {}
        # tagger = NER(home + '/Downloads/stanford-ner-4.2.0/stanford-ner-2020-11-17/classifiers/english.muc.7class.distsim.crf.ser.gz',
        #              home + '/Downloads/stanford-ner-4.2.0/stanford-ner-2020-11-17/stanford-ner.jar')

        # tagged_terms = tagger.tag(terms)
        # [print(x) for x in terms]
        # [print(x) for x in tagged_terms if x[1] != 'O']

        # after NER remove terms

        # get term syn
        # check syn ag terms[i]
        # if match then add term to d

        for term in terms:
            response = requests.get(url + term)
            try:
                syn = [x['definitions'][0]['synonyms'] for x in response.json()[0].get(
                    'meanings') if(x['partOfSpeech'] == 'noun')]

                # if terms[0] in cat.keys():

                for s in syn:
                    cat[term] = []
                    if s in terms:
                        cat[term].append(s)
            except:
                pass

        print(cat)

        # term: [term syn]
