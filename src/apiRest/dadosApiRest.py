import csv
import json
import pyodbc

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")

def regiao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select * from Regiao")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["id", "regiao"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)

def comunidade():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select * from Comunidade")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["id", "comunidade", "cidade", "regiao"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)

def cultura():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select * from Cultura")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["id", "nome_cultura"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)

def produtividade_agricultor():
    cnxn = create_connection()
    cursor = cnxn.cursor()
	# visualizacao da produtividade de um agricultor. exibidas as seguintes informacoes no grafico:
	# area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio
    cursor.execute("select id_agricultor, area_plantada, quantidade_produzida, nome_cultura, data_plantio from Producao inner join Cultura on Producao.id_cultura=Cultura.id order by Producao.id limit 10")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
	# falta a data
    col = ["id_agricultor", "area_plantada", "quantidade_produzida", "nome_cultura", "data_plantio"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)

def produtividade_regiao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
	# visualizacao da produtividade de uma regiao, exibidas as seguintes informacoes no grafico:
	# area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio
    cursor.execute("select id_agricultor, area_plantada, quantidade_produzida, nome_cultura, data_plantio from Producao inner join Cultura on Producao.id_cultura=Cultura.id order by Producao.id limit 10")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["id_agricultor", "area_plantada", "quantidade_produzida", "nome_cultura"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)


def montaJson(spamreader, col):
	response = []
	colunas = col
	i = 0
	for row in spamreader:
		celulas = {}
		for indexColumns in range(0,len(colunas)):
			celulas[colunas[indexColumns]] = row[indexColumns]
		response.append(celulas)
		i = i + 1;
	return response
