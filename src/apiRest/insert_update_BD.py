## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-
import pyodbc
import time

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")


def insert_Agricultor(nome, sexo, id_comunidade, ano_adesao, variedade_algodao):
    cnxn = create_connection()
    cursor = cnxn.cursor()


    try:
        if(ano_adesao == ""):
          cursor.execute("INSERT INTO Agricultor2(nome_agricultor,sexo,id_comunidade,variedade_algodao) VALUES (?,?,?,?);", nome.encode('utf-8'), sexo, id_comunidade, variedade_algodao.encode('utf-8'))
        else:
          cursor.execute("INSERT INTO Agricultor2(nome_agricultor,sexo,id_comunidade,ano_adesao,variedade_algodao) VALUES (?,?,?,?,?);", nome.encode('utf-8'), sexo, id_comunidade, ano_adesao, variedade_algodao.encode('utf-8'))
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


def remove_Agricultor(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("DELETE FROM Agricultor2 WHERE id=?", id)
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




def update_custos_atividade(id, id_atividade,valor_unitario,quantidade, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if (valor_unitario==None or quantidade==None):
      response= 'false'
    else:
      try:
        cursor.execute("UPDATE Custo_Regiao_Teste SET id_atividade= ?, valor_unitario=?, quantidade=?, ano=? WHERE id=?", id_atividade,valor_unitario,quantidade, ano, id)
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


def remove_Atividade(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("DELETE FROM Custo_Regiao_Teste WHERE id=?", id)
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


def insert_Atividade(valor_atividade,quantidade_atividade,atividade_custo,id_regiao, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    area = 1

    cursor.execute("SELECT DISTINCT area FROM Custo_Regiao_Teste WHERE id_regiao=%d and ano=%d" %(id_regiao,ano))
    rows = cursor.fetchall()

    if (len(rows) != 0):
      area = rows[0][0]

    try:
        cursor.execute("INSERT INTO Custo_Regiao_Teste(id_atividade,id_regiao,quantidade,valor_unitario,area, ano) VALUES (?,?,?,?,?,?);", atividade_custo, id_regiao,quantidade_atividade,valor_atividade,area, ano)
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


def update_area_Atividade(area, id_regiao, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("UPDATE Custo_Regiao_Teste SET area= ? WHERE id_regiao=? and ano=?", area, id_regiao, ano)
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


def update_valor_mercado(id, id_cultura,valor_mercado, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if (valor_mercado==None):
      response= 'false'
    else:
      try:
        cursor.execute("UPDATE Valor_Venda_Teste SET id_cultura= ?, valor=?, ano=? WHERE id=?", id_cultura,valor_mercado, ano, id)
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

def remove_valor_mercado(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("DELETE FROM Valor_Venda_Teste WHERE id=?", id)
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


def insert_valor_mercado(id_cultura,valor_mercado,id_regiao, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    try:
        cursor.execute("INSERT INTO Valor_Venda_Teste(id_cultura,id_regiao,valor, ano) VALUES (?,?,?,?);", id_cultura, id_regiao,valor_mercado, ano)
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


def update_add_tecnicas_e(id, nome):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if (nome==""):
      response= 'false'
    else:
      try:
        cursor.execute("UPDATE Tecnica_Teste SET nome_tecnica= ? WHERE id=?", nome.encode('utf-8'), id)
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

def remove_add_tecnicas_e(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("DELETE FROM Tecnica_Teste WHERE id=?", id)
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


def insert_add_tecnicas_e(nome):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
        cursor.execute("INSERT INTO Tecnica_Teste(nome_tecnica) VALUES (?);", nome)
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

def update_add_atividade_e(id, nome, unidade):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    if (nome==""):
      response= 'false'
    else:
      try:
        cursor.execute("UPDATE Atividade_Teste SET atividade= ?, unidade=? WHERE id=?", nome,unidade, id)
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


def remove_add_atividade_e(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("DELETE FROM Atividade_Teste WHERE id=?", id)
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

def insert_add_atividade_e(nome, unidade):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
        cursor.execute("INSERT INTO Atividade_Teste(atividade, unidade) VALUES (?,?);", nome, unidade)
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

def update_add_regiao_e(id, nome):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    if (nome==""):
      response= 'false'
    else:
      try:
        cursor.execute("UPDATE Regiao_Teste SET nome_regiao= ? WHERE id=?", nome, id)
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


def remove_add_regiao_e(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("DELETE FROM Regiao_Teste WHERE id=?", id)
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

def insert_add_regiao_e(nome):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
        cursor.execute("INSERT INTO Regiao_Teste(nome_regiao) VALUES (?);", nome)
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