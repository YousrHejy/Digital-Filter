import numpy as np
import pandas as pd
from scipy import signal


i = 0
zeros = []
poles = []
gain = 1
b = []
a = []
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
    @staticmethod
    # def mapLibrary(x, y):
    #     return str(str(x) + "+" + str(y) + "j")

    

    @staticmethod
    def makeFilter():  # Compute the frequency response of a digital filter in ZPK form.
        # w is the omega or the x axis of the magnitude and frequency response values
        # h is an array that hold two array one is the magnitude and one is the phase
        global w, h, zeros, poles, gain
        w, h = signal.freqz_zpk(zeros, poles, gain, fs=1000)

    @staticmethod
    def filterData(originalData):
        global b, a, FilteredSignalYData, graphData, zeros, poles, gain
        #  Return polynomial transfer function representation from zeros and poles
        b, a = signal.zpk2tf(zeros, poles, gain)
        #  signal.lfilter(): Filter data along one-dimension with an IIR or FIR filter.
        FilteredSignalYData = (signal.lfilter(b, a, originalData))  # --> The output of the digital filter.
        FilteredSignalYData = np.real(FilteredSignalYData)/100
        # if len(graphData) == 0:
        return FilteredSignalYData

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

    # @staticmethod
    # def formatToCoordinates(x):
    #     return [np.real(x) * 100 + 150, np.imag(x) * (-100) + 150]
