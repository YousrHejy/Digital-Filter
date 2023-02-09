import numpy as np
from flask import (Flask, json, jsonify, render_template, request)
from functions import Functions
import functions
import pandas as pd


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('main.html')


@app.route('/getzeros', methods=['POST'])
def getZeros():
    if request.method == 'POST':
        functions.zeros = json.loads(request.data)
        return jsonify(0)
    return render_template("main.html")


@app.route('/getpoles', methods=['POST', 'GET'])
def getPoles():
    if request.method == 'POST':
        data = request.data
        data = json.loads(data)
        functions.poles = data
        return jsonify(data)
    return render_template("main.html")

@app.route('/exportFilter', methods=['GET','POST'])
def export_filer():
    if request.method == 'POST':
        result = request.json['sendflag']
        print(result)
        # square = lambda x: x ** 2

        # arr = np.array([square(val) for val in arr])
        export_zeros = pd.DataFrame( {'zeros': functions.zeros} )
        # print(export_zeros)
        export_poles = pd.DataFrame( {'poles': functions.poles} )
        # print(export_poles)
        data = pd.concat([export_zeros,export_poles], axis=1)
        # print(data)
        data = pd.DataFrame(data)
        print(data)
        data.to_csv('D:/SBME/3rd year/Dsp/task 5/Digital-Filter/filters/filter_{str(datetime.now())}.csv', index=False)
        # read_data = pd.read_csv('D:/SBME/3rd year/Digital-Filter/filters/filter_{str(datetime.now())}.csv')
        # print(read_data)
        return jsonify({
            "sucess":"done",
        })  
    else:
        return render_template("main.html")

@app.route('/sendfrequencyresposedata', methods=['POST', 'GET'])
def sendData():
    if request.method == 'GET':
        functions.zeros = list(map(Functions.format, functions.zeros))
        functions.poles = list(map(Functions.format, functions.poles))
        functions.zeros = [*functions.zeros]
        functions.poles = [*functions.poles]
        temp = Functions.frequencyResponse()
        return jsonify(temp)
    return render_template("main.html")

@app.route('/getSignals', methods=['POST', 'GET'])
def dataFilter():
    if request.method == 'POST':
        value = request.json['y_axis']
        value = np.array(value)
        data = Functions.filterData(value)
        return jsonify({
            'yAxisData': data.tolist(),
        })
    else:
        return render_template("main.html")


if __name__ == '__main__':
    app.run()
