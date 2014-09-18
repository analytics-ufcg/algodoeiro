## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-
import json
import collections
import operator

def montaListaJson(spamreader, col):
	response = []
	colunas = col
	for row in spamreader:
		celulas = {}
		for indexColumns in range(0,len(colunas)):
			celulas[colunas[indexColumns]] = row[indexColumns]
		response.append(celulas)
	return response

def montaDict(spamreader, col, keyindex):
	response = {}
	colunas = col
	for row in spamreader:
		celulas = {}
		for indexColumns in range(0,len(colunas)):
			celulas[colunas[indexColumns]] = row[indexColumns]
		response[row[keyindex]] = celulas
	return response

def montaJson(response,sorted = False):
	return json.dumps(response,sort_keys=sorted,default=date_handler).encode('utf8')

def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj