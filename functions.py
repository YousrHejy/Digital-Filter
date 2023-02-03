import numpy as np
import pandas as pd
from scipy import signal


i = 0
zeros = []
poles = []
gain = 1
b = []
a = []
AllPassFiltersReal = []
AllPassFiltersImg = []
AllPassFiltersZeros = []
AllPassFiltersPoles = []
w = []
h = []
originalData = []
MagnitudePlotData = []
AnglePlotData = []
FilteredSignalYData = []
library = []
path = ""
size = 125
graphData = []
signalData = []
SignalXAxisData = []
SignalYAxisData = []
dataLength = 0


class Functions:
    @staticmethod
    def getMyData():
        global signalData, SignalXAxisData, SignalYAxisData, dataLength, path
        signalData = pd.read_csv(path)
        SignalXAxisData = signalData.values[:, 0]
        SignalYAxisData = signalData.values[:, 1]
        dataLength = len(SignalXAxisData)

    @staticmethod
    def mapLibrary(x, y):
        return str(str(x) + "+" + str(y) + "j")

    @staticmethod
    def readLibrary():
        global AllPassFiltersReal, AllPassFiltersImg, library
        data = pd.read_csv(r'library.csv')
        AllPassFiltersReal = data.values[:, 0]
        AllPassFiltersImg = data.values[:, 1]
        library = list(map(Functions.mapLibrary, AllPassFiltersReal, AllPassFiltersImg))

    @staticmethod
    def writeLibrary():
        global AllPassFiltersReal, AllPassFiltersImg
        df = pd.DataFrame(AllPassFiltersImg, AllPassFiltersReal)
        df.to_csv('library.csv')

    @staticmethod
    def makeFilter():
        # w is the omega or the x axis of the magnitude and frequency response values
        # h is an array that hold two array one is the magnitude and one is the phase
        global w, h, zeros, poles, gain
        w, h = signal.freqz_zpk(zeros, poles, gain, fs=1000)

    @staticmethod
    def allPassFilterMaker():
        global zeros, poles, MagnitudePlotData, AnglePlotData, library, w
        Functions.makeFilter()
        Functions.getFrequencyResponse()
        zeros = np.array(
            [[np.real(zeros[0]) * 100 + 150,
              np.imag(zeros[0]) * (-100) + 150]])
        poles = np.array(
            [[np.real(poles[0]) * 100 + 150,
              np.imag(poles[0]) * (-100) + 150]])

        return {
            'library': library,
            'zeros': zeros.tolist(),
            'poles': poles.tolist(),
            'w': w.tolist(),
            'magnitude': MagnitudePlotData.tolist(),
            'angle': AnglePlotData.tolist()
        }

    @staticmethod
    def filterData(originalData):
        global b, a, FilteredSignalYData, graphData, zeros, poles, gain
        b, a = signal.zpk2tf(zeros, poles, gain)
        FilteredSignalYData = (signal.lfilter(b, a, originalData))
        FilteredSignalYData = np.real(FilteredSignalYData)

        if len(graphData) == 0:
            graphData = FilteredSignalYData
        else:
            graphData = np.delete(graphData, 0)
            graphData = np.append(graphData, FilteredSignalYData[-1])

    @staticmethod
    def getFrequencyResponse():
        global MagnitudePlotData, AnglePlotData, h
        MagnitudePlotData = 20 * np.log10(abs(h))
        AnglePlotData = np.unwrap(np.angle(h))
        MagnitudePlotData = np.around(MagnitudePlotData, 4)

    @staticmethod
    def format(x):
        return x[0] + 1j * x[1]

    @staticmethod
    def frequencyResponse():
        global w, MagnitudePlotData, AnglePlotData
        Functions.makeFilter()
        Functions.getFrequencyResponse()
        return {
            'w': w.tolist(),
            'magnitude': MagnitudePlotData.tolist(),
            'angle': AnglePlotData.tolist()
        }

    @staticmethod
    def formatToCoordinates(x):
        return [np.real(x) * 100 + 150, np.imag(x) * (-100) + 150]