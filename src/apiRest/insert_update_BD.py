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
          cursor.execute("INSERT INTO Agricultor(nome_agricultor,sexo,id_comunidade,variedade_algodao) VALUES (?,?,?,?);", nome.encode('utf-8'), sexo, id_comunidade, variedade_algodao.encode('utf-8'))
        else:
          cursor.execute("INSERT INTO Agricultor(nome_agricultor,sexo,id_comunidade,ano_adesao,variedade_algodao) VALUES (?,?,?,?,?);", nome.encode('utf-8'), sexo, id_comunidade, ano_adesao, variedade_algodao.encode('utf-8'))
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
    if (ano_adesao == None):
      ano_adesao=""
    if (nome=="" or variedade_algodao=="" or ano_adesao == ""):
      response= 'false'
    elif((int(ano_adesao)<1990 or int(ano_adesao)>9999) and len(ano_adesao) != 4):
      response= 'false'
    else:
      try:
        if(ano_adesao == "" and ano_adesao ==None):
          cursor.execute("UPDATE Agricultor SET nome_agricultor= ?, sexo=?, ano_adesao=?, variedade_algodao=?, id_comunidade=? WHERE id=?", nome.encode('utf-8'), sexo, None, variedade_algodao.encode('utf-8'),id_comunidade, id)
        else:
          cursor.execute("UPDATE Agricultor SET nome_agricultor= ?, sexo=?, ano_adesao=?, variedade_algodao=?, id_comunidade=? WHERE id=?", nome.encode('utf-8'), sexo, ano_adesao, variedade_algodao.encode('utf-8'),id_comunidade, id)
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
      cursor.execute("DELETE FROM Agricultor WHERE id=?", id)
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


def adicionarAno():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("INSERT INTO Ano SELECT MAX(ano_producao)+1 FROM Ano")
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
        cursor.execute("UPDATE Custo_Regiao SET id_atividade= ?, valor_unitario=?, quantidade=?, ano=? WHERE id=?", id_atividade,valor_unitario,quantidade, ano, id)
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
      cursor.execute("DELETE FROM Custo_Regiao WHERE id=?", id)
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

    cursor.execute("SELECT DISTINCT area FROM Custo_Regiao WHERE id_regiao=%d and ano=%d" %(id_regiao,ano))
    rows = cursor.fetchall()

    if (len(rows) != 0):
      area = rows[0][0]

    try:
        cursor.execute("INSERT INTO Custo_Regiao(id_atividade,id_regiao,quantidade,valor_unitario,area, ano) VALUES (?,?,?,?,?,?);", atividade_custo, id_regiao,quantidade_atividade,valor_atividade,area, ano)
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
      cursor.execute("UPDATE Custo_Regiao SET area= ? WHERE id_regiao=? and ano=?", area, id_regiao, ano)
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
        cursor.execute("UPDATE Valor_Venda SET id_cultura= ?, valor=?, ano=? WHERE id=?", id_cultura,valor_mercado, ano, id)
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
      cursor.execute("DELETE FROM Valor_Venda WHERE id=?", id)
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
        cursor.execute("INSERT INTO Valor_Venda(id_cultura,id_regiao,valor, ano) VALUES (?,?,?,?);", id_cultura, id_regiao,valor_mercado, ano)
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
        cursor.execute("UPDATE Tecnica SET nome_tecnica= ? WHERE id=?", nome.encode('utf-8'), id)
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
      cursor.execute("DELETE FROM Tecnica WHERE id=?", id)
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
        cursor.execute("INSERT INTO Tecnica(nome_tecnica) VALUES (?);", nome.encode('utf-8'))
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
        cursor.execute("UPDATE Atividade SET atividade= ?, unidade=? WHERE id=?", nome.encode('utf-8'),unidade.encode('utf-8'), id)
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
      cursor.execute("DELETE FROM Atividade WHERE id=?", id)
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
        cursor.execute("INSERT INTO Atividade(atividade, unidade) VALUES (?,?);", nome.encode('utf-8'), unidade.encode('utf-8'))
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
        cursor.execute("UPDATE Regiao SET nome_regiao= ? WHERE id=?", nome.encode('utf-8'), id)
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
      cursor.execute("DELETE FROM Regiao WHERE id=?", id)
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
        cursor.execute("INSERT INTO Regiao(nome_regiao) VALUES (?);", nome.encode('utf-8'))
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


def update_add_culturas_e(id, nome):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if (nome=="" or id == 1 or id == 15 or id == 3):
      response= 'false'
    else:
      try:
        cursor.execute("UPDATE Cultura SET nome_cultura= ? WHERE id=?", nome.encode('utf-8'), id)
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

def remove_add_culturas_e(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if (id == 1 or id == 15 or id == 3):
      response = 'false'
    else:
      try:
        cursor.execute("DELETE FROM Cultura WHERE id=?", id)
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

def insert_add_culturas_e(nome):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("INSERT INTO Cultura(nome_cultura) VALUES (?);", nome.encode('utf-8'))
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


def update_add_certificados_e(id, nome, simplificado):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    if (nome=="" or simplificado==""):
      response= 'false'
    else:
      try:
        cursor.execute("UPDATE Certificacao SET nome_certificacao= ?, nome_simplificado_certificacao= ? WHERE id=?", nome.encode('utf-8'), simplificado.encode('utf-8'), id)
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


def remove_add_certificados_e(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("DELETE FROM Certificacao WHERE id=?", id)
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

def insert_add_certificados_e(nome, simplificado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if(nome=="" or simplificado==""):
      response = 'false'
    else:
      try:
          cursor.execute("INSERT INTO Certificacao(nome_certificacao, nome_simplificado_certificacao) VALUES (?,?);", nome.encode('utf-8'), simplificado.encode('utf-8'))
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

def update_add_comunidade_e(id, nome_comunidade, nome_cidade, id_regiao):
    cnxn = create_connection()
    cursor = cnxn.cursor()

    if (nome_comunidade=="" or nome_cidade==""):
      response= 'false'
    else:
      try:
        cursor.execute("UPDATE Comunidade SET nome_comunidade= ?, nome_cidade= ?, id_regiao=? WHERE id=?", nome_comunidade.encode('utf-8'), nome_cidade.encode('utf-8'),id_regiao, id)
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

def remove_add_comunidade_e(id):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("DELETE FROM Comunidade WHERE id=?", id)
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

def insert_add_comunidade_e(nome_comunidade, nome_cidade, regiao):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if(nome_comunidade=="" or nome_cidade==""):
      response = 'false'
    else:
      try:
          cursor.execute("INSERT INTO Comunidade(nome_comunidade, nome_cidade, id_regiao) VALUES (?,?, ?);", nome_comunidade.encode('utf-8'), nome_cidade.encode('utf-8'), regiao)
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

def altera_senha(usuario, nova_senha):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
      cursor.execute("UPDATE Usuario SET pass=? WHERE usuario=?", nova_senha.encode('utf-8'), usuario.encode('utf-8'))
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