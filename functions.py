import numpy as np
import pandas as pd
from scipy import signal


i = 0
zeros = []
poles = []
gain = 1
b = []  # Numerator polynomial coefficients.
a = []  # Denominator polynomial coefficients.
AllPassFiltersReal = []  # real part of all pass filter
AllPassFiltersImg = []  # imaginary part of all pass filter
AllPassFiltersZeros = []  # zeros of all pass filter
AllPassFiltersPoles = []  # poles of all pass filter
# The frequencies at which h was computed, in the same units as fs. By default, w is normalized to the
# range [0, pi) (radians/sample). --> from signal.freqz_zpk() function.
# another def: (h is an array that hold two array one is the magnitude and one is the phase).
w = []
# The frequency response, as complex numbers. --> from signal.freqz_zpk() function.
# anther def: (h is an array that hold two array one is the magnitude and one is the phase).
h = []
originalData = []
MagnitudePlotData = []
AnglePlotData = []
FilteredSignalYData = []  # The output of the digital filter
library = []  # selection box of all pass filter
path = ""
size = 125
graphData = []
signalData = []  # from read csv in getMyData function
SignalXAxisData = []  # x-axis of signalData
SignalYAxisData = []  # y-axis of signalData
dataLength = 0  # length of SignalXAxisData (x-axis of signalData)


class Functions:
    @staticmethod
    def getMyData():
        global signalData, SignalXAxisData, SignalYAxisData, dataLength, path
        signalData = pd.read_csv(path)
        SignalXAxisData = signalData.values[:, 0]
        SignalYAxisData = signalData.values[:, 1]
        dataLength = len(SignalXAxisData)

    @staticmethod
    # complex number form (x+yj) --> take values from users and as real and imaginary and combine them in complex form
    # to put them in list (all pass filter), (in string data type)
    def mapLibrary(x, y):
        return str(str(x) + "+" + str(y) + "j")

    @staticmethod
    def readLibrary():
        global AllPassFiltersReal, AllPassFiltersImg, library
        data = pd.read_csv(r'library.csv')  # ex: data = [(0.5+0.5j), (1+1j), (1.25+1.25j), (0.6+0.6j), ...]
        AllPassFiltersReal = data.values[:, 0]
        AllPassFiltersImg = data.values[:, 1]
        # take real and imaginary and apply them in mapLibrary function to be in complex form and put them in list:
        library = list(map(Functions.mapLibrary, AllPassFiltersReal, AllPassFiltersImg))

    @staticmethod
    def writeLibrary():  # put all pass filter (real part, imaginary part) in csv to sent to front.
        global AllPassFiltersReal, AllPassFiltersImg
        df = pd.DataFrame(AllPassFiltersImg, AllPassFiltersReal)
        df.to_csv('library.csv')

    @staticmethod
    def makeFilter():  # Compute the frequency response of a digital filter in ZPK form.
        # w is the omega or the x axis of the magnitude and frequency response values
        # h is an array that hold two array one is the magnitude and one is the phase
        global w, h, zeros, poles, gain
        w, h = signal.freqz_zpk(zeros, poles, gain, fs=1000)

    @staticmethod
    def allPassFilterMaker():
        global zeros, poles, MagnitudePlotData, AnglePlotData, library, w
        Functions.makeFilter()  # --> to compute w
        Functions.getFrequencyResponse()  # --> to get MagnitudePlotData and AnglePlotData
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
        #  Return polynomial transfer function representation from zeros and poles
        b, a = signal.zpk2tf(zeros, poles, gain)
        #  signal.lfilter(): Filter data along one-dimension with an IIR or FIR filter.
        FilteredSignalYData = (signal.lfilter(b, a, originalData))  # --> The output of the digital filter.
        FilteredSignalYData = np.real(FilteredSignalYData)
        # if len(graphData) == 0:
        return FilteredSignalYData
        # else:
        #     graphData = np.delete(graphData, 0)
        #     graphData = np.append(graphData, FilteredSignalYData[-1])
        # return graphData

    @staticmethod
    def getFrequencyResponse():
        global MagnitudePlotData, AnglePlotData, h
        MagnitudePlotData = 20 * np.log10(abs(h))  # --> to get the mag of plot data.
        AnglePlotData = np.unwrap(np.angle(h))  # --> to get the angle of plot data.
        MagnitudePlotData = np.around(MagnitudePlotData, 4)

    @staticmethod
    def format(x):  # complex form (not in string data type)
        return x[0] + 1j * x[1]

    @staticmethod
    def frequencyResponse():
        global w, MagnitudePlotData, AnglePlotData
        Functions.makeFilter()  # --> to get w
        Functions.getFrequencyResponse()  # to compute MagnitudePlotData and AnglePlotData
        return {
            'w': w.tolist(),  # to convert w from ndarray to list
            'magnitude': MagnitudePlotData.tolist(),  # to convert MagnitudePlotData from ndarray to list
            'angle': AnglePlotData.tolist()  # to convert AnglePlotData from ndarray to list
        }

    @staticmethod
    def formatToCoordinates(x):
        return [np.real(x) * 100 + 150, np.imag(x) * (-100) + 150]
