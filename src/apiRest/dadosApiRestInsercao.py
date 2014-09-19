## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-

import json
import pyodbc
import collections
import operator
import dadosApiRestRegiao
import funcoesAux
from datetime import datetime

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")

def producoes_e(id_agricultor,ano):
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

def atualizar_producoes(dados, id_agricultor, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    id_producao = dados["id_producao"]

    id_cultura = dados["id"]
    area_plantada = 1 if (dados["area"]==None or dados["area"]=="") else dados["area"]
    quantidade = dados["quantidade_produzida"]

    data_plantio = ("01/01/"+str(ano)) if (dados["data"]==None or dados["data"]=="") else dados["data"]


    try:
        if(quantidade is None or quantidade == ''):
            cursor.execute("DELETE FROM Producao2 WHERE id=? and year(data_plantio)=?", id_producao, ano)
        else:
          if(id_producao is None):
              cursor.execute("INSERT INTO Producao2(id_agricultor,id_cultura,area_plantada,quantidade_produzida,data_plantio) VALUES (?,?,?,?,?);", id_agricultor,id_cultura,area_plantada,quantidade,data_plantio)
          else:
              cursor.execute("UPDATE Producao2 SET quantidade_produzida= ?,data_plantio=?,area_plantada=? WHERE id=?", quantidade, data_plantio,area_plantada,id_producao)

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

def editar_tecnica(dados , id_agricultor, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    id_tecnica_adotada = dados["id_tecnica_adotada"]

    id_tecnica = dados["id"]
    utilizou = dados["utilizou"]
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

def update_area_produdao_e(dados, id_agricultor, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    area_plantada = dados["area_plantada"]
    try:
      cursor.execute("UPDATE Producao2 SET area_plantada= ? WHERE id_agricultor=? and year(data_plantio)=?", area_plantada, id_agricultor, ano)
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

def update_data_produdao_e(dados, id_agricultor, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    data = dados["data"]

    #data =datetime.strptime(data, '%d/%m/%Y').strftime('%Y/%m/%d')

    try:
      cursor.execute("UPDATE Producao2 SET data_plantio= ? WHERE id_agricultor=? and year(data_plantio)=?", data, id_agricultor, ano)
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

def usuarios():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM Usuario")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "login", "senha"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

