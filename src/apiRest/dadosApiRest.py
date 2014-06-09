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
    return montaJson(lista_tuplas, col)

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
    return montaJson(lista_tuplas, col)

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
    return montaJson(lista_tuplas, col)

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
    return montaJson(lista_tuplas, col)

def produtividade_agricultores():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select a.id, c.nome_cultura, sum(p.quantidade_produzida) from Agricultor a, Producao p, Cultura c where a.id = p.id_agricultor and c.id=p.id_cultura and year(p.data_plantio) = 2011 group by a.id, c.nome_cultura order by a.id")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["id", "nome_cultura","producao"]
    return montaJson(lista_tuplas, col)

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
    newJson = '{"name": "agricultor","children":'+ montaJson(lista_tuplas, col) +'}'
    return newJson

def produtividade_regiao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
	# visualizacao da produtividade de uma regiao, exibidas as seguintes informacoes no grafico:
	# area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio
    cursor.execute("select cu.nome_cultura, p.quantidade_produzida from Producao p, Agricultor a, Comunidade c, Regiao r, Cultura cu where p.id_agricultor=a.id and a.id_comunidade=c.id and c.id_regiao=1 and cu.id=p.id_cultura and year(p.data_plantio)=2011")
    apodi = cursor.fetchall()

    cursor.execute("select cu.nome_cultura, p.quantidade_produzida from Producao p, Agricultor a, Comunidade c, Regiao r, Cultura cu where p.id_agricultor=a.id and a.id_comunidade=c.id and c.id_regiao=3 and cu.id=p.id_cultura and year(p.data_plantio)=2011")
    pajeu = cursor.fetchall()

    cursor.execute("select cu.nome_cultura, p.quantidade_produzida from Producao p, Agricultor a, Comunidade c, Regiao r, Cultura cu where p.id_agricultor=a.id and a.id_comunidade=c.id and c.id_regiao=2 and cu.id=p.id_cultura and year(p.data_plantio)=2011")
    cariri = cursor.fetchall()
    cnxn.close()
    lista_tuplas_apodi = []
    for tupla in apodi:
       lista_tuplas_apodi.append(tupla)


    lista_tupla_tupla = collections.defaultdict(list)
    for item in lista_tuplas_apodi:
        lista_tupla_tupla[item[0]].append(item)
    # find sum of values
    lista_tuplas_apodi = []
    for key, value in lista_tupla_tupla.items():
        lista_final = [key] + map(sum, zip(*value)[1:])
	lista_final = tuple(lista_final)
        lista_tuplas_apodi.append(lista_final)


    lista_tuplas_cariri = []
    for tupla in cariri:
       lista_tuplas_cariri.append(tupla)

    lista_tupla_tupla2 = collections.defaultdict(list)
    for item in lista_tuplas_cariri:
        lista_tupla_tupla2[item[0]].append(item)
    # find sum of values
    lista_tuplas_cariri = []
    for key, value in lista_tupla_tupla2.items():
        lista_final = [key] + map(sum, zip(*value)[1:])
	lista_final = tuple(lista_final)
        lista_tuplas_cariri.append(lista_final)


    lista_tuplas_pajeu = []
    for tupla in pajeu: #tava in apodi :D
       lista_tuplas_pajeu.append(tupla)

    lista_tupla_tupla3 = collections.defaultdict(list)
    for item in lista_tuplas_pajeu:
        lista_tupla_tupla3[item[0]].append(item)
    # find sum of values
    lista_tuplas_pajeu = []
    for key, value in lista_tupla_tupla3.items():
        lista_final = [key] + map(sum, zip(*value)[1:])
	lista_final = tuple(lista_final)
        lista_tuplas_pajeu.append(lista_final)

    col = ["name", "size"]
    newJson = '{"name": "regiao","children": [{"name": "Apodi","children":'+ montaJson(lista_tuplas_apodi, col) +'}, {"name": "Cariri","children":'+ montaJson(lista_tuplas_cariri, col) +'},{"name": "Pajeu","children":'+ montaJson(lista_tuplas_pajeu, col) +'}]}'
    return newJson


def montaJson(spamreader, col):
	response = []
	colunas = col
	for row in spamreader:
		celulas = {}
		for indexColumns in range(0,len(colunas)):
			celulas[colunas[indexColumns]] = row[indexColumns]
		response.append(celulas)
	return json.dumps(response,default=date_handler)

def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj

