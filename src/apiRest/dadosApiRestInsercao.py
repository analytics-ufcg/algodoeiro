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

def producoes_2(id_agricultor,ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select * from (select id, nome_agricultor from agricultor where id = %d) a, "
                   "(select c.id as id_cultura, c.nome_cultura, p.id_producao, p.area_plantada, p.quantidade_produzida, p.data_plantio from cultura c left outer join "
                   "( select id as id_producao, id_cultura, area_plantada, quantidade_produzida, data_plantio from producao2 p where p.id_agricultor = %d and "
                   "year(p.data_plantio) = %d ) p ON c.id = p.id_cultura) c" % (id_agricultor,id_agricultor,ano))
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id_agricultor", "nome_agricultor", "id","nome_cultura","id_producao","area","quantidade_produzida","data"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def tecnicas_e(id_agricultor,ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select * from (select id, nome_agricultor from agricultor where id = %d) a, "
                   "(select t.id as id_tecnica, t.nome_tecnica, ta.id_tecnica_adotada "
                   "from tecnica t left outer join "
                   "( select id as id_tecnica_adotada, id_tecnica "
                   "from tecnica_adotada2 t where t.id_agricultor = %d and "
                   "t.ano = %d ) ta ON t.id = ta.id_tecnica) c" % (id_agricultor,id_agricultor,ano))
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id_agricultor", "nome_agricultor", "id","nome_tecnica","id_tecnica_adotada"]
    lista = funcoesAux.montaListaJson(rows, col)
    for element in lista:
        element["utilizou"] = (not element["id_tecnica_adotada"] is None)
    return funcoesAux.montaJson(lista)

def atualizar_producoes(dados):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    id_producao = dados["id_producao"]

    id_agricultor = dados["id_agricultor"]
    id_cultura = dados["id"]
    area_plantada = dados["area"]
    quantidade = dados["quantidade_produzida"]
    data_plantio = dados["data"]

    try:
        if(id_producao is None):
            cursor.execute("INSERT INTO Producao2(id_agricultor,id_cultura,area_plantada,quantidade_produzida,data_plantio) VALUES (?,?,?,?,?);", id_agricultor,id_cultura,area_plantada,quantidade,data_plantio)
        else:
            cursor.execute("UPDATE Producao2 SET quantidade_produzida= ? WHERE id=?", quantidade, id_producao)
        cursor.commit()
        response = 'true'
    except Exception, e:
        # Rollback in case there is any error
       print "ERRO"
       print e
       response = 'false'
       cursor.rollback()

    cnxn.close()
    return response

def editar_tecnica(dados):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    id_tecnica_adotada = dados["id_tecnica_adotada"]

    id_agricultor = dados["id_agricultor"]
    id_tecnica = dados["id"]
    utilizou = dados["utilizou"]
    ano = 2010
    try:
        if(utilizou and id_tecnica_adotada is None):
            cursor.execute("INSERT INTO Tecnica_Adotada2(id_agricultor,ano,id_tecnica) VALUES (?,?,?);", id_agricultor,ano,id_tecnica)
        if (not utilizou and not id_tecnica_adotada is None):
            cursor.execute("DELETE FROM Tecnica_Adotada2 WHERE id=?", id_tecnica_adotada)
        cursor.commit()
        response = 'true'

    except Exception, e:
        # Rollback in case there is any error
       print "ERRO"
       print e
       response = 'false'
       cursor.rollback()

    cnxn.close()
    return response

def update_Agricultor(id, nome, sexo, ano_adesao, variedade_algodao, id_comunidade):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if (nome=="" or variedade_algodao==""):
      response= 'false'
    elif(ano_adesao != "" and (int(ano_adesao)<1990 or int(ano_adesao)>9999) and len(ano_adesao) != 4):
      response= 'false'
    else:
      try:
        if(ano_adesao == ""):
          cursor.execute("UPDATE Agricultor2 SET nome_agricultor= ?, sexo=?, ano_adesao=?, variedade_algodao=?, id_comunidade=? WHERE id=?", nome.encode('utf-8'), sexo, None, variedade_algodao.encode('utf-8'),id_comunidade, id)
        else:
          cursor.execute("UPDATE Agricultor2 SET nome_agricultor= ?, sexo=?, ano_adesao=?, variedade_algodao=?, id_comunidade=? WHERE id=?", nome.encode('utf-8'), sexo, ano_adesao, variedade_algodao.encode('utf-8'),id_comunidade, id)
        print "SUCESSO"
        cursor.commit()
        response = 'true'
      except Exception, e:
        print "ERRO"
        print e
        response = 'false'
        cursor.rollback()

    cnxn.close()
    return response


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

