## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-
import pyodbc
import time

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")


def insert_Agricultor():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    
#    cursor.execute("SELECT nome_agricultor, sexo, ano_adesao FROM Agricultor")
#    rows = cursor.fetchall()
    
    try:
        cursor.execute("INSERT INTO Agricultor2(nome_agricultor,sexo,ano_adesao) VALUES (?,?,?);", "JOAO PAULO", "M", 2014)
        cursor.commit()
    except:
        # Rollback in case there is any error
       print "ERRO"
       cursor.rollback()

    cnxn.close()

def update_Agricultor(id, nome, sexo, ano_adesao, variedade_algodao, comunidade):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
       cursor.execute("SELECT id from Comunidade where nome_comunidade=?",comunidade)
       id_comunidade = cursor.fetchall()
       cursor.execute("UPDATE Agricultor SET nome_agricultor= ?, sexo=?, ano_adesao=?, variedade_algodao=?, id_comunidade=? WHERE id=?", nome, sexo, ano_adesao, variedade_algodao,id_comunidade[0][0], id)
       print "SUCESSO"
       cursor.commit()
    except:
       print "ERRO"
       cursor.rollback()
    cnxn.close()
