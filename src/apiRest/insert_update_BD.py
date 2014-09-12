## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-
import pyodbc
import time

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")


def insert_Agricultor(nome, sexo, id_comunidade, ano_adesao, variedade_algodao):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    
    print nome

#    cursor.execute("SELECT nome_agricultor, sexo, ano_adesao FROM Agricultor")
#    rows = cursor.fetchall()
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
    try:
       cursor.execute("UPDATE Agricultor2 SET nome_agricultor= ?, sexo=?, ano_adesao=?, variedade_algodao=?, id_comunidade=? WHERE id=?", nome.encode('utf-8'), sexo, ano_adesao, variedade_algodao.encode('utf-8'),id_comunidade, id)
       print "SUCESSO"
       cursor.commit()
    except:
       print "ERRO"
       cursor.rollback()
    cnxn.close()
