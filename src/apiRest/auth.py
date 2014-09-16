import json
import pyodbc
import collections
import operator
import funcoesAux

class Login():
    global taLog

    def __init__(self):
            self.taLog = False

    def sessao(self):
	    return  '[{"value":' + '"' + str(self.taLog) + '"' + '}]'

    def getStatus(self):
        return self.taLog

    def setStatus(self, status):
        self.taLog = status
