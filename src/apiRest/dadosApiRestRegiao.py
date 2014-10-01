## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-

import json
import pyodbc
import collections
import operator
import funcoesAux

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")

def regiao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM Regiao order by nome_regiao")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "regiao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def regiao_produtoras():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select r.id, r.nome_regiao "
                   "from regiao r, comunidade c, agricultor a, producao p "
                   "where r.id = c.id_regiao and c.id = a.id_comunidade and a.id = p.id_agricultor "
                   "group by r.id, nome_regiao order by nome_regiao")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "regiao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))


def media_producao_regiao(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT r.id as id_regiao, r.nome_regiao, cu.id as id_cultura , cu.nome_cultura, avg(p.quantidade_produzida) as media_producao FROM Cultura cu, Producao p, Agricultor a, Comunidade c, Regiao r WHERE year(p.data_plantio) = %d and cu.id = p.id_cultura and p.id_agricultor = a.id and a.id_comunidade = c.id and c.id_regiao = r.id and p.quantidade_produzida > 0 group by r.id,r.nome_regiao, cu.id, cu.nome_cultura order by r.id, cu.id" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id_regiao", "nome_regiao","id_cultura","nome_cultura","producao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def producao_regiao(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    # visualizacao da producao de uma regiao, exibidas as seguintes informacoes no grafico:
    # area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio

    cursor.execute("SELECT r.nome_regiao, cu.nome_cultura,  sum(p.quantidade_produzida) FROM Producao p, Agricultor a, Comunidade c, "
                   "Regiao r, Cultura cu WHERE p.id_agricultor=a.id and a.id_comunidade=c.id and  cu.id=p.id_cultura and r.id=c.id_regiao "
                   "and year(p.data_plantio)=%d group by r.nome_regiao, cu.nome_cultura order by r.nome_regiao" % ano)
    regiao_rows = cursor.fetchall()
    cnxn.close()

    return funcoesAux.montaJson(montaListaJsonRegiao(regiao_rows),True)

def anos():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    # visualizacao dos anos que temos informacoes:
    cursor.execute("SELECT * FROM Ano")
    anos_rows = cursor.fetchall()

    cursor2 = cnxn.cursor()
    # visualizacao dos anos que temos informacoes:
    cursor2.execute("SELECT distinct year(p.data_plantio) FROM Producao p")
    anos_producao = cursor2.fetchall()

    cnxn.close()

    lista_tuplas = []
    for a in anos_rows:
        lista_tuplas.append(tuple(a)+ (anos_producao.__contains__(a),));
    col = ["id", "producao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(lista_tuplas, col))


def custo_total_regiao(ano):
    col = ["nome_regiao", "total"]
    return '{"Regioes":' + funcoesAux.montaJson(funcoesAux.montaListaJson(custo_aux(ano), col)) + '}'

def custo_aux(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT r.nome_regiao, SUM(c.quantidade*c.valor_unitario), c.area FROM Custo_Regiao c, Regiao r WHERE r.id = c.id_regiao and c.ano=%d group by r.nome_regiao, c.area" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for linhas in rows:
       lista_tuplas.append((linhas[0],round(linhas[1]/linhas[2],2),))
    return lista_tuplas

def montaListaJsonRegiao(rows):
    culturas = {}
    regioes = []
    regioes_das_culturas = {}
    
    for row in rows:
       regiao = row[0]
       cultura = row[1]
       producao = row[2]
       if (not culturas.has_key(cultura)):
          culturas[cultura] = []
          regioes_das_culturas[cultura] = []

       culturas[cultura].append({'regiao':regiao,'producao':producao,'cultura':cultura})
       regioes_das_culturas[cultura].append(regiao)

       if (not (regiao in regioes)):
          regioes.append(regiao)

    for cultura in culturas.keys():

        regioes_da_cultura = regioes_das_culturas[cultura]
        regioes_faltando = set(regioes) - set(regioes_da_cultura)
        for regiao_faltando in regioes_faltando:
            culturas[cultura].append({'regiao':regiao_faltando,'producao':0,'cultura':cultura})
        culturas[cultura].sort(key=lambda x: x['regiao'], reverse=False)
    return culturas


