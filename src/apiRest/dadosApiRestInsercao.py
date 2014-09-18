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

def producoes_e(id_agricultor,ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT id_agricultor, nome_agricultor,  data_plantio, area, id_producao, quantidade_produzida,"
                   " c.id as id_cultura, nome_cultura FROM cultura c LEFT OUTER JOIN "
                   "(select a.id as id_agricultor, a.nome_agricultor as nome_agricultor, p.id as id_producao, p.id_cultura as id_cultura, "
                   "p.data_plantio as data_plantio, p.quantidade_produzida as quantidade_produzida, p.area_plantada as area "
                   " from agricultor a, producao p where a.id = p.id_agricultor and a.id = %d and year(p.data_plantio) = %d) p "
                   "ON c.id = p.id_cultura" % (id_agricultor,ano))
    rowsProducao = cursor.fetchall()
    colunasProducao = ["id_producao","quantidade_produzida","id_cultura","nome_cultura"]

    cursor.execute("SELECT id_agricultor, nome_agricultor, a.id_tecnica_utilizada, t.id as id_tecnica, nome_tecnica            "
                   "FROM tecnica t LEFT OUTER JOIN                    	"
                   "(select a.id as id_agricultor, a.nome_agricultor as nome_agricultor, t.id as id_tecnica_utilizada, t.id_tecnica, t.ano as ano "
                   "from agricultor a, tecnica_adotada t where a.id = t.id_agricultor and a.id = %d and ano = %d) a "
                   "ON t.id = a.id_tecnica" % (id_agricultor,ano))

    colunasTecnicas = ["id_tecnica_utilizada","id_tecnica","nome_tecnica"]

    rowsTecnicas = cursor.fetchall()


    cnxn.close()
    response = {}

    area = None
    nome_agricultor = None
    id_agricultor = None
    data_plantio = None

    if len(rowsProducao) > 0 and not (rowsProducao[0].id_agricultor == None):
        firstRow = rowsProducao[0]
        area = firstRow.area
        nome_agricultor = firstRow.nome_agricultor
        id_agricultor = firstRow.id_agricultor
        data_plantio = firstRow.data_plantio
        response["nome_agricultor"] = nome_agricultor
        response["id_agricultor"] = id_agricultor
        response["data_plantio"] = data_plantio
        response["area"] = area

    producoes = []
    for row in rowsProducao:
        celulas = {}
        for indexColumns in range(0,len(colunasProducao)):
            celulas[colunasProducao[indexColumns]] = row[indexColumns+4]
        producoes.append(celulas)
    response["producoes"] = producoes

    tecnicas = []
    for row in rowsTecnicas:
        celulas = {}
        for indexColumns in range(0,len(colunasTecnicas)):
            celulas[colunasTecnicas[indexColumns]] = row[indexColumns+2]
        tecnicas.append(celulas)

    response["tecnicas"] = tecnicas

    return funcoesAux.montaJson(response)

def usuarios():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM Usuario")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "login", "senha"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

