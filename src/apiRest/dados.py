import csv
import json
import pyodbc
import datetime
from time import mktime
import collections
from collections import namedtuple
import csv


def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")

def produtividade_regiao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
	# visualizacao da produtividade de uma regiao, exibidas as seguintes informacoes no grafico:
	# area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio

    cursor.execute("select * from Cultura")
    culturas = cursor.fetchall()

    cursor.execute("select * from Regiao")
    regioes = cursor.fetchall()

    cursor.execute("select r.nome_regiao, cu.nome_cultura,  sum(p.quantidade_produzida) from Producao p, Agricultor a, Comunidade c, Regiao r, Cultura cu where p.id_agricultor=a.id and a.id_comunidade=c.id and  cu.id=p.id_cultura and r.id=c.id_regiao and year(p.data_plantio)=2011 group by r.nome_regiao, cu.nome_cultura")
    producoes = cursor.fetchall()
    cnxn.close()
    
    csv = []
    csv_head = ["Regiao"]
    for cultura in culturas:
       csv_head.append(cultura[1])
    csv.append(csv_head)

    for regiao in regioes:
       csv_prod = [regiao[1]]
       for quant in range(len(csv_head)):
          quant_producoes_por_regiao = len(csv_prod)
          for producao in producoes:
             if producao[0] == csv_prod[0] and producao[1] == csv_head[quant]:
                csv_prod.append(producao[2])
          if quant_producoes_por_regiao == len(csv_prod) and quant != 0:
             csv_prod.append(0)
       csv.append(tuple(csv_prod))

    return montaJson(csv)

def produtividade_regiaoJson():
    cnxn = create_connection()
    cursor = cnxn.cursor()
  # visualizacao da produtividade de uma regiao, exibidas as seguintes informacoes no grafico:
  # area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio

    cursor.execute("select * from Cultura")
    culturas = cursor.fetchall()

    cursor.execute("select * from Regiao")
    regioes = cursor.fetchall()

    cursor.execute("select r.nome_regiao, cu.nome_cultura,  sum(p.quantidade_produzida) from Producao p, Agricultor a, Comunidade c, Regiao r, Cultura cu where p.id_agricultor=a.id and a.id_comunidade=c.id and  cu.id=p.id_cultura and r.id=c.id_regiao and year(p.data_plantio)=2011 group by r.nome_regiao, cu.nome_cultura")
    producoes = cursor.fetchall()
    cnxn.close()
    print producoes
    # csv = []
    # csv_head = ["Regiao"]
    # for cultura in culturas:
    #    csv_head.append(cultura[1])
    # csv.append(csv_head)

    # for regiao in regioes:
    #    csv_prod = [regiao[1]]
    #    for quant in range(len(csv_head)):
    #       quant_producoes_por_regiao = len(csv_prod)
    #       for producao in producoes:
    #          if producao[0] == csv_prod[0] and producao[1] == csv_head[quant]:
    #             csv_prod.append(producao[2])
    #       if quant_producoes_por_regiao == len(csv_prod) and quant != 0:
    #          csv_prod.append(0)
    #    csv.append(tuple(csv_prod))

    return 'a'

def montaListaJson(spamreader, col):
	response = []
	colunas = col
	for row in spamreader:
		celulas = {}
		for indexColumns in range(0,len(colunas)):
			celulas[row[0][indexColumns]] = row[indexColumns]
		response.append(celulas)
	return response

def montaJson(response):
	return json.dumps(response)

