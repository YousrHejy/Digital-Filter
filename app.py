import numpy as np
from flask import (Flask, json, jsonify, render_template, request)
from functions import Functions
import functions


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('main.html')


@app.route('/getzeros', methods=['POST'])
def getZeros():
    if request.method == 'POST':
        functions.zeros = json.loads(request.data)
        return jsonify(0)
    return render_template("index.html")


@app.route('/getpoles', methods=['POST', 'GET'])
def getPoles():
    if request.method == 'POST':
        data = request.data
        data = json.loads(data)
        functions.poles = data
        return jsonify(data)
    return render_template("index.html")


@app.route('/getallpassfilter', methods=['POST', 'GET'])
def getAllPassFilter():
    if request.method == 'POST':
        data = json.loads(request.data)
        if (type(data) == str):
            functions.i = int(data)
            temp = functions.AllPassFiltersReal[functions.i] + 1j * functions.AllPassFiltersImg[functions.i]
            functions.zeros = [1 / np.conjugate(temp)]
            functions.poles = [temp]
        else:
            temp = data[0] + 1j * data[1]
            functions.zeros = [1 / np.conjugate(temp)]
            functions.poles = [temp]
        return jsonify(0)
    return render_template("index.html")


@app.route('/sendallpassfilter', methods=['POST', 'GET'])
def sendAllPassFilter():
    if request.method == 'GET':
        temp = Functions.allPassFilterMaker()
        return jsonify(temp)
    return render_template("index.html")


@app.route('/updatelibrary', methods=['POST', 'GET'])
def updateLibrary():
    if request.method == 'GET':
        Functions.readLibrary()
        return jsonify(functions.library)
    if request.method == 'POST':
        data = json.loads(request.data)
        functions.AllPassFiltersReal = np.append(functions.AllPassFiltersReal, data[0])
        functions.AllPassFiltersImg = np.append(functions.AllPassFiltersImg, data[1])
        Functions.writeLibrary()
        Functions.readLibrary()
        return jsonify(functions.library)
    return render_template("index.html")


@app.route('/sendfrequencyresposedata', methods=['POST', 'GET'])
def sendData():
    if request.method == 'GET':
        functions.zeros = list(map(Functions.format, functions.zeros))
        functions.poles = list(map(Functions.format, functions.poles))
        functions.zeros = [*functions.zeros, *functions.AllPassFiltersZeros]
        functions.poles = [*functions.poles, *functions.AllPassFiltersPoles]
        temp = Functions.frequencyResponse()
        return jsonify(temp)
    return render_template("index.html")


@app.route('/activateordeactivateallpassfilter', methods=['POST', 'GET'])
def ActivateAllPassFilter():
    if request.method == 'POST':
        data = int(json.loads(request.data))
        functions.a = float(
            functions.AllPassFiltersReal[data]) + float(functions.AllPassFiltersImg[data]) * 1j
        tempzeros = 1 / np.conjugate(functions.a)
        temppoles = functions.a
        if tempzeros in functions.AllPassFiltersZeros:
            functions.AllPassFiltersZeros.remove(tempzeros)
        else:
            functions.AllPassFiltersZeros.append(tempzeros)
        if temppoles in functions.AllPassFiltersPoles:
            functions.AllPassFiltersPoles.remove(temppoles)
        else:
            functions.AllPassFiltersPoles.append(temppoles)
        tempzeros = list(map(Functions.formatToCoordinates, functions.AllPassFiltersZeros))
        temppoles = list(map(Functions.formatToCoordinates, functions.AllPassFiltersPoles))
        return jsonify({
            'allpassfilterzeros': tempzeros,
            'allpassfilterpoles': temppoles
        })
    return render_template("index.html")


@app.route('/getSignals', methods=['POST', 'GET'])
def dataFilter():
    if request.method == 'POST': 
        value = request.json['y_axis']
        value = np.array(value)
        data=Functions.filterData(value)
        return jsonify({
            'yAxisData': data.tolist(),
        })
    else :
        return render_template("main.html")


@app.route('/getData', methods=['POST'])
def my_form_post():
    if request.method == 'POST':
        functions.path = json.loads(request.data)
        Functions.getMyData()
        return jsonify(functions.path)
    return render_template("main.html")


if __name__ == '__main__':
    app.run()