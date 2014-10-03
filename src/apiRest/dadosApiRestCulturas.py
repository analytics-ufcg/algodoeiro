## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-

import json
import pyodbc
import collections
import operator
import dadosApiRestRegiao
import funcoesAux

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")

def algodao_id():
    return funcoesAux.montaJson([1])

def pluma_id():
    return funcoesAux.montaJson([15])

def caroco_id():
    return funcoesAux.montaJson([3])

