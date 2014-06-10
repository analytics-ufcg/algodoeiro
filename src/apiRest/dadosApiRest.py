import csv
import json
import pyodbc
import datetime
from time import mktime
import collections


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
    return montaJson(montaListaJson(lista_tuplas, col))

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
    return montaJson(montaListaJson(lista_tuplas, col))

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
    return montaJson(montaListaJson(lista_tuplas, col))

def agricultores():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.id_regiao,r.nome_regiao from agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and r.id = c.id_regiao order by id")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["id", "nome_agricultor","id_comunidade","nome_comunidade","id_regiao","nome_regiao"]
    return montaJson(montaListaJson(lista_tuplas, col))

def media_producao_regiao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select r.id as id_regiao, r.nome_regiao, cu.id as id_cultura , cu.nome_cultura, avg(p.quantidade_produzida) as media_producao from Cultura cu, Producao p, Agricultor a, Comunidade c, Regiao r where cu.id = p.id_cultura and p.id_agricultor = a.id and a.id_comunidade = c.id and c.id_regiao = r.id and p.quantidade_produzida > 0 group by r.id,r.nome_regiao, cu.id, cu.nome_cultura order by r.id, cu.id")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["id_regiao", "nome_regiao","id_cultura","nome_cultura","media_producao"]
    return montaJson(montaListaJson(lista_tuplas, col))

def produtividade_agricultores():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select a.id as id_agricultor, c.nome_cultura, c.id as id_cultura, sum(p.quantidade_produzida) from Agricultor a, Producao p, Cultura c where a.id = p.id_agricultor and c.id=p.id_cultura and year(p.data_plantio) = 2011 group by a.id, c.id, c.nome_cultura order by a.id")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["id_agricultor", "nome_cultura","id_cultura","producao"]
    return montaJson(montaListaJson(lista_tuplas, col))

def produtividade_agricultor(id_agricultor):
    cnxn = create_connection()
    cursor = cnxn.cursor()
	# visualizacao da produtividade de um agricultor. exibidas as seguintes informacoes no grafico:
	# area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio
	# TESTE a.nome_agricultor, p.area_plantada, , p.data_plantio  and year(p.data_plantio)=2010
    cursor.execute("select c.nome_cultura, p.quantidade_produzida from Producao p, Cultura c where p.id_agricultor=%d and c.id=p.id_cultura" %(id_agricultor))
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)

    lista_tupla_tupla = collections.defaultdict(list)
    for item in lista_tuplas:
        lista_tupla_tupla[item[0]].append(item)
    # find sum of values
    lista_tuplas = []
    for key, value in lista_tupla_tupla.items():
        lista_final = [key] + map(sum, zip(*value)[1:])
	lista_final = tuple(lista_final)
        lista_tuplas.append(lista_final)
 
    col = ["nome_cultura", "quantidade_produzida"]
    newJson = '{"name": "agricultor","children":'+ montaJson(montaListaJson(lista_tuplas, col)) +'}'
    return newJson

def produtividade_regiao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
	# visualizacao da produtividade de uma regiao, exibidas as seguintes informacoes no grafico:
	# area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio

    cursor.execute("select r.nome_regiao, cu.nome_cultura,  sum(p.quantidade_produzida) from Producao p, Agricultor a, Comunidade c, Regiao r, Cultura cu where p.id_agricultor=a.id and a.id_comunidade=c.id and  cu.id=p.id_cultura and r.id=c.id_regiao and year(p.data_plantio)=2011 group by r.nome_regiao, cu.nome_cultura order by r.nome_regiao")
    regiao = cursor.fetchall()
    cnxn.close()

    lista_tuplas_regiao = []
    for tupla in regiao:
       lista_tuplas_regiao.append(tupla[1:3])

    col_cultura = ["name", "size"]

    children = montaListaJson(lista_tuplas_regiao, col_cultura)

    lista_tupla_regiao_cultura =[]
    for i,j in zip(range(0,len(regiao)), children):
       lista_tupla_regiao_cultura.append((regiao[i][0],j))

    dicionario_regiao_cultura ={}
    for elemento in lista_tupla_regiao_cultura:
        if not elemento[0] in dicionario_regiao_cultura.keys():
            dicionario_regiao_cultura[elemento[0]] = []
        dicionario_regiao_cultura[elemento[0]].append(elemento[1:2][0])

    tupla_regiao_cultura = []
    for i in dicionario_regiao_cultura.keys():
       tupla_regiao_cultura.append((i,dicionario_regiao_cultura[i]))

    col_regiao = ["name", "children"]
    return '{"name": "regiao","children":'+ montaJson(montaListaJson(tupla_regiao_cultura,col_regiao))+'}'


def montaListaJson(spamreader, col):
	response = []
	colunas = col
	for row in spamreader:
		celulas = {}
		for indexColumns in range(0,len(colunas)):
			celulas[colunas[indexColumns]] = row[indexColumns]
		response.append(celulas)
	return response

def montaJson(response):
	return json.dumps(response,default=date_handler)

def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj

