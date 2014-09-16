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
    cursor.execute("SELECT id_agricultor, nome_agricultor, id_producao, quantidade_produzida, data_plantio,"
                   " c.id as id_cultura, nome_cultura FROM cultura c LEFT OUTER JOIN "
                   "(select a.id as id_agricultor, a.nome_agricultor as nome_agricultor, p.id as id_producao, p.id_cultura as id_cultura, "
                   "p.data_plantio as data_plantio, p.quantidade_produzida as quantidade_produzida "
                   " from agricultor a, producao p where a.id = p.id_agricultor and a.id = %d and year(p.data_plantio) = %d) p "
                   "ON c.id = p.id_cultura" % (id_agricultor,ano))
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id_agricultor","nome_agricultor","id_producao","quantidade_produzida","data_plantio","id_cultura","nome_cultura"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def usuarios():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM Usuario")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "login", "senha"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

