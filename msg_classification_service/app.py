from flask import Flask,render_template,url_for,request
import pandas as pd 
import numpy as np
import re
import string
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
import pickle as p
from nltk.tokenize import RegexpTokenizer
from nltk.stem.snowball import SnowballStemmer
stemmer = SnowballStemmer("english")
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import zipfile
import bz2

app = Flask(__name__)

def preprocess(msg):
    tokenizer = RegexpTokenizer(r'\w+')
    lemmatizer = WordNetLemmatizer()
    stop_words = stopwords.words("english")
    stop_words.extend(['news', 'report', 'affect' ,'say','use', 'not', 'would', 'say', 'could', '_', 'be', 'know', 'good', 'go', 'get', 'do','took','time','year', 'people', 'heavy', 'government', 'done', 'try', 'many', 'some','nice', 'thank', 'think', 'see', 'rather', 'easy', 'easily', 'lot', 'lack', 'make', 'want', 'seem', 'run', 'need', 'even', 'right', 'line','even', 'also', 'may', 'take', 'come', 'new','said', 'like','people','fuck','sex','good'])

    s = re.sub(r'http[s]?[ ]?:[ ]?//\S+', '', msg.lower())
    s = re.sub(r'[^a-zA-Z ]', '', s)
    s = tokenizer.tokenize(s)
    s = [w for w in s if w not in stop_words]
    s = [stemmer.stem(i) for i in s]
    s = [lemmatizer.lemmatize(i) for i in s]
    s = [' '.join(s)]
    return s

@app.route('/')
def home():
    return render_template('home.html',len = 0, message = None, prediction = None)

@app.route('/predict',methods=['POST'])
def predict():
    if request.method == 'POST':
        message1 = request.form['message']
        message = request.form['message']
        message = preprocess(message)
        data = tv.transform(message)
        print(data.data)
        if len(data.data) != 0 :
            my_prediction = clf.predict(data)
            categories = ['related',
                    'request',
                    'offer',
                    'medical_and_other_aids',
                    'search_and_rescue',
                    'army_and_police',
                    'child_alone',
                    'needs',
                    'missing_people',
                    'refugees',
                    'death',
                    'disasters',
                    'fire',
                    'direct_report']
            l = []
            for i in range (len(my_prediction[0])):
                if(my_prediction[0][i] == 1):
                    l.append(categories[i])
            print(l)
        else:
            l = []
            prediction = None
       
    return render_template('home.html', len = len(l), message = message1, prediction = l)


if __name__ == '__main__':
    clffile = bz2.BZ2File('model_14\smallerfile', 'rb')
  #  clffile = 'model_14/clf_RF_14.pickle'
    tvfile = 'model_14/tfidf_RF_14.pickle'
    clf = p.load(clffile)
    tv = p.load(open(tvfile, 'rb'))
    app.run(debug = True)