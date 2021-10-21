from nltk.tag import StanfordNERTagger as NER
import os

home = os.path.expanduser("~")


class categorization:

    def term_categorization(terms):
        tagger = NER(home + '/Downloads/stanford-ner-4.2.0/stanford-ner-2020-11-17/classifiers/english.muc.7class.distsim.crf.ser.gz',
                     home + '/Downloads/stanford-ner-4.2.0/stanford-ner-2020-11-17/stanford-ner.jar')

        tagged_terms = tagger.tag(terms)

        [print(x) for x in terms]
        [print(x) for x in tagged_terms if x[1] != 'O']

        return tagged_terms
