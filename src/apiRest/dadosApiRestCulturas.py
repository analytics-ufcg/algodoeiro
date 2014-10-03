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

def algodao_id(esta_logado):
    valor = []
    if esta_logado:
       valor = [1]

    return funcoesAux.montaJson(valor)

def pluma_id(esta_logado):
    valor = []
    if esta_logado:
       valor = [15]

    return funcoesAux.montaJson(valor)

def caroco_id(esta_logado):
    valor = []
    if esta_logado:
       valor = [3]

    return funcoesAux.montaJson(valor)

