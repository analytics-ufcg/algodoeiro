## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-
import pyodbc
import time

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")


def insert_Agricultor(nome, sexo, id_comunidade, ano_adesao, variedade_algodao):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    
#    cursor.execute("SELECT nome_agricultor, sexo, ano_adesao FROM Agricultor")
#    rows = cursor.fetchall()
    
    try:
        for i in range(10):
            cursor.execute("INSERT INTO Agricultor2(nome_agricultor,sexo,id_comunidade,ano_adesao,variedade_algodao) VALUES (?,?,?,?,?);", nome, sexo, id_comunidade, ano_adesao, variedade_algodao)
        cursor.commit()
    except:
        # Rollback in case there is any error
       print "ERRO"
       cursor.rollback()

    cnxn.close()

def update_Agricultor(id, nome, sexo, ano_adesao):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
       #cursor.execute("SELECT id from Comunidade where nome_comunidade=?",comunidade)
       #id_comunidade = cursor.fetchall()
       cursor.execute("UPDATE Agricultor2 SET nome_agricultor= ?, sexo=?, ano_adesao=? WHERE id=?", nome, sexo, ano_adesao, id)
       print "sucesso"
       cursor.commit()
    except:
       print "ERRO"
       cursor.rollback()
    cnxn.close()


def insert_Tecnica(nome):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    
    try:
        for i in range(10):
            cursor.execute("INSERT INTO Tecnicas2(nome_tecnica) VALUES (?);", nome)
        cursor.commit()
    except:
        # Rollback in case there is any error
       print "ERRO"
       cursor.rollback()

    cnxn.close()

def update_Tecnica(id, nome_tecnica):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    try:
       #cursor.execute("SELECT id from Comunidade where nome_comunidade=?",comunidade)
       #id_comunidade = cursor.fetchall()
       cursor.execute("UPDATE Tecnicas2 SET nome_tecnica=? WHERE id=?", nome_tecnica, id)
       print "sucesso"
       cursor.commit()
    except:
       print "ERRO"
       cursor.rollback()
    cnxn.close()

def insert_Producao(area, quantidade_produzida, data_plantio):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    
    try:
        for i in range(10):
            cursor.execute("INSERT INTO Producao2(id_agricultor, id_cultura, area_plantada, quantidade_produzida, data_plantio) VALUES (?,?,?,?,?);", 3, i, area, quantidade_produzida, data_plantio)
        cursor.commit()
    except:
        # Rollback in case there is any error
       print "ERRO"
       cursor.rollback()

    cnxn.close()



if __name__ == '__main__':
    ini = time.time()
    #update_Agricultor(4, "Ademar Alves", "M", 2010)
    insert_Agricultor("Ademar Alves", "M", 2, 2014, "Algodao")
    #insert_Tecnica("cortando desbaste com trator");
    #update_Tecnica(8,"cortando desbaste com Andryw");
    #insert_Producao(1.1, 250, "2012-02-02")
    fim = time.time()
    print "Funcao soma2: ", fim-ini
