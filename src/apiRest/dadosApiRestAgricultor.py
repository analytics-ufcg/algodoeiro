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

def agricultores(esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if esta_logado:
        cursor.execute("SELECT a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao FROM agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and r.id = c.id_regiao order by id")
        col = ["certificacoes","id", "nome_agricultor","id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    else:
        cursor.execute("SELECT a.id, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao FROM agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and r.id = c.id_regiao order by id")
        col = ["certificacoes","id", "id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    rowsAgricultor = cursor.fetchall()
    cnxn.close()
    return funcoesAux.montaJson(funcoesAux.montaListaJson(colocar_certificacoes(rowsAgricultor), col))

def agricultores_com_producao(esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if esta_logado:
        cursor.execute("SELECT distinct a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao FROM agricultor a, comunidade c, regiao r, Producao p where a.id_comunidade = c.id and r.id = c.id_regiao and p.id_agricultor=a.id and p.quantidade_produzida > 0 order by id")
        col = ["certificacoes","id", "nome_agricultor","id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    else:
        cursor.execute("SELECT distinct a.id, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao FROM agricultor a, comunidade c, regiao r, Producao p where a.id_comunidade = c.id and r.id = c.id_regiao and p.id_agricultor=a.id and p.quantidade_produzida > 0 order by id")
        col = ["certificacoes","id", "id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    rows = cursor.fetchall()
    cnxn.close()
    
    return funcoesAux.montaJson(funcoesAux.montaListaJson(colocar_certificacoes(rows), col))

def produtores_algodao(esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if esta_logado:
        cursor.execute("SELECT distinct a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao FROM agricultor a, comunidade c, regiao r, Producao p where a.id_comunidade = c.id and r.id = c.id_regiao and p.id_agricultor=a.id and p.quantidade_produzida > 0 and p.id_cultura=1 order by id")
        col = ["certificacoes","id", "nome_agricultor","id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    else:
        cursor.execute("SELECT distinct a.id, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao FROM agricultor a, comunidade c, regiao r, Producao p where a.id_comunidade = c.id and r.id = c.id_regiao and p.id_agricultor=a.id and p.quantidade_produzida > 0 and p.id_cultura=1 order by id")
        col = ["certificacoes","id", "id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]

    rows = cursor.fetchall()
    cnxn.close()

    return funcoesAux.montaJson(funcoesAux.montaListaJson(colocar_certificacoes(rows), col))

def producao_agricultores(ano, esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    
    if esta_logado:
        cursor.execute("SELECT a.id as id_agricultor, c.nome_cultura, c.id as id_cultura, sum(p.quantidade_produzida), p.area_plantada as area, r.nome_regiao, a.nome_agricultor FROM Agricultor a, Producao p, Cultura c, Comunidade co, Regiao r where a.id = p.id_agricultor and c.id=p.id_cultura and year(p.data_plantio) = %d and p.id_agricultor = a.id and a.id_comunidade = co.id and co.id_regiao = r.id group by a.id, c.id, c.nome_cultura, p.area_plantada, r.nome_regiao, a.nome_agricultor order by a.id" % ano)
        col = ["id_agricultor", "nome_cultura","id_cultura","producao", "area_plantada", "nome_regiao", "nome_agricultor"]
    else:
        cursor.execute("SELECT a.id as id_agricultor, c.nome_cultura, c.id as id_cultura, sum(p.quantidade_produzida), p.area_plantada as area, r.nome_regiao FROM Agricultor a, Producao p, Cultura c, Comunidade co, Regiao r where a.id = p.id_agricultor and c.id=p.id_cultura and year(p.data_plantio) = %d and p.id_agricultor = a.id and a.id_comunidade = co.id and co.id_regiao = r.id group by a.id, c.id, c.nome_cultura, p.area_plantada, r.nome_regiao order by a.id" % ano)
        col = ["id_agricultor", "nome_cultura","id_cultura","producao", "area_plantada", "nome_regiao"]
    rows = cursor.fetchall()
    cnxn.close()
    
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))


def receita_agricultor(ano, esta_logado):
    print esta_logado
    if esta_logado:
        col = ["id_agricultor", "nome_regiao", "nome_agricultor", "receita"]
    else:
        col = ["id_agricultor", "nome_regiao", "receita"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(receita_aux(ano, esta_logado), col))

def receita_aux(ano, esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if esta_logado:
        cursor.execute("SELECT a.id, r.nome_regiao, a.nome_agricultor, ROUND(SUM(p.quantidade_produzida*v.valor)/ p.area_plantada,2) FROM Regiao r, Producao p, Valor_Venda v, Agricultor a, Comunidade c where r.id=v.id_regiao and p.id_cultura=v.id_cultura and year(p.data_plantio)=%d and v.ano=year(p.data_plantio) and a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id group by a.id, r.nome_regiao, a.nome_agricultor, p.area_plantada" % ano)
    else:
        cursor.execute("SELECT a.id, r.nome_regiao, ROUND(SUM(p.quantidade_produzida*v.valor)/ p.area_plantada,2) FROM Regiao r, Producao p, Valor_Venda v, Agricultor a, Comunidade c where r.id=v.id_regiao and p.id_cultura=v.id_cultura and year(p.data_plantio)=%d and v.ano=year(p.data_plantio) and a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id group by a.id, r.nome_regiao, p.area_plantada" % ano)

    rows = cursor.fetchall()
    cnxn.close()

    return rows

def lucro_agricultor(ano, esta_logado):
    rec = receita_aux(ano, esta_logado)
    cust = dadosApiRestRegiao.custo_aux(ano)
    lista_tuplas = []
    if esta_logado:
        for receitas in rec:
            for custos in cust:
                if (receitas[1] == custos[0]):
                    lista_tuplas.append(receitas[0:3]+(round(receitas[3]-custos[1],2),))
        col = ["id_agricultor","nome_regiao", "nome_agricultor", "lucro"]
    else:
        for receitas in rec:
            for custos in cust:
                if (receitas[1] == custos[0]):
                    lista_tuplas.append(receitas[0:2]+(round(receitas[2]-custos[1],2),))
        col = ["id_agricultor","nome_regiao", "lucro"]

    return funcoesAux.montaJson(funcoesAux.montaListaJson(lista_tuplas, col))

def produtividade_agricultores(ano, esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if esta_logado:
        cursor.execute("SELECT a.id, r.id, r.nome_regiao, a.nome_agricultor, p.quantidade_produzida, p.area_plantada FROM Regiao r, Producao p, Agricultor a, Comunidade c where year(p.data_plantio)=%d and a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id and p.id_cultura=1" % ano)
        col = ["id_agricultor","id_regiao","nome_regiao", "nome_agricultor", "produtividade", "area_plantada"]
        posicaoQuantProduzida = 4
        posicaoAreaPlantada = 5
    else:
        cursor.execute("SELECT a.id, r.id, r.nome_regiao, p.quantidade_produzida, p.area_plantada FROM Regiao r, Producao p, Agricultor a, Comunidade c where year(p.data_plantio)=%d and a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id and p.id_cultura=1" % ano)
        col = ["id_agricultor","id_regiao","nome_regiao", "produtividade", "area_plantada"]
        posicaoQuantProduzida = 3
        posicaoAreaPlantada = 4
    rows = cursor.fetchall()
    cnxn.close()

    lista_tuplas = []

    for linhas in rows:
        elemento = linhas[0:posicaoQuantProduzida]+(calculaProdutividade(linhas[posicaoQuantProduzida],linhas[posicaoAreaPlantada]),) + (linhas[posicaoAreaPlantada],)
        lista_tuplas.append(elemento)

    return funcoesAux.montaJson(funcoesAux.montaListaJson(lista_tuplas, col))

def tecnica_agricultores(ano, esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    #Seleciona informacoes de agricultor e da produtividade
    if esta_logado:
        cursor.execute("SELECT a.id, a.nome_agricultor, r.id, r.nome_regiao, p.quantidade_produzida, p.area_plantada FROM Agricultor a, Comunidade co, Regiao r, Producao p where year(p.data_plantio) = %d and a.id_comunidade=co.id and co.id_regiao=r.id and p.id_agricultor = a.id and p.id_cultura=1" %ano)
        col = ["tecnicas","id_agricultor","nome_agricultor", "id_regiao", "nome_regiao", "produtividade"]
        posicaoQuantProduzida = 5
        posicaoAreaPlantada = 6
    else:
        cursor.execute("SELECT a.id, r.id, r.nome_regiao, p.quantidade_produzida, p.area_plantada FROM Agricultor a, Comunidade co, Regiao r, Producao p where year(p.data_plantio) = %d and a.id_comunidade=co.id and co.id_regiao=r.id and p.id_agricultor = a.id and p.id_cultura=1" %ano)
        col = ["tecnicas","id_agricultor", "id_regiao", "nome_regiao", "produtividade"]
        posicaoQuantProduzida = 4
        posicaoAreaPlantada = 5
    rowsAgricultor = cursor.fetchall()

    cursor2 = cnxn.cursor()
    #Seleciona informacoes das tecnicas
    cursor2.execute("SELECT a.id, t.id, t.nome_tecnica FROM Agricultor a, Tecnica t, Tecnica_Adotada ta where a.id = ta.id_agricultor and ta.id_tecnica=t.id and ta.ano = %d" %ano)
    rowsTecnicas = cursor2.fetchall()

    cnxn.close()

    lista_tuplas=[]
    tecnicas = {}
    for row in rowsTecnicas:
        id_agricultor = row[0]
        id_tecnica = row[1]
        tecnica = row[2]
        if(not tecnicas.has_key(id_agricultor)):
            tecnicas[id_agricultor] = []
        tecnicas[id_agricultor].append({'id':id_tecnica,'tecnica':tecnica})

    for row in rowsAgricultor:
        id_agricultor = row[0]
        if(tecnicas.has_key(id_agricultor)):
            tecnicasAgricultor = tecnicas[id_agricultor]
            lista_tuplas.append((tecnicasAgricultor,)+tuple(row))
        else:
            lista_tuplas.append(([],)+tuple(row))


    lista_tuplas_aux = []
    for linhas in lista_tuplas:
        elemento = linhas[0:posicaoQuantProduzida]+(calculaProdutividade(linhas[posicaoQuantProduzida],(linhas[posicaoAreaPlantada])),)
        lista_tuplas_aux.append(elemento)

    return funcoesAux.montaJson(funcoesAux.montaListaJson(lista_tuplas_aux, col))

#Quantidade produzida e area plantada devem ser os ultimos parametros do select e devem estar nessa ordem.
def calculaProdutividade(producao,area):
    return round(producao/area*0.5)

def culturas_por_agricultor(ano, esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if esta_logado:
        cursor.execute("SELECT a.id, a.nome_agricultor, p.quantidade_produzida, p.area_plantada FROM Producao p, Agricultor a where year(p.data_plantio)=%d and p.id_agricultor=a.id and p.id_cultura=1" % ano)
        col = ["id_agricultor", "nome_agricultor","producao", "produtividade", "area_plantada", "nome_cultura", "id_cultura"]
    else:
        cursor.execute("SELECT a.id, p.quantidade_produzida, p.area_plantada FROM Producao p, Agricultor a where year(p.data_plantio)=%d and p.id_agricultor=a.id and p.id_cultura=1" % ano)
        col = ["id_agricultor", "producao", "produtividade", "area_plantada", "nome_cultura", "id_cultura"]
    rows = cursor.fetchall()

    cursor2 = cnxn.cursor()
    cursor2.execute("SELECT a.id, c.nome_cultura, c.id FROM Producao p, Agricultor a, Cultura c where year(p.data_plantio)=%d and p.id_agricultor=a.id and p.id_cultura=c.id and c.id !=1 and c.id !=15 and c.id !=3 and c.id != 7 and c.id!= 14 and c.id!=4" % ano)
    rows2 = cursor2.fetchall()    
    cnxn.close()
    
    posicaoQuantProduzida = 2
    posicaoAreaPlantada = 3
    
    lista_tuplas = []
    for linhas in rows:
      elemento = linhas[0:posicaoAreaPlantada]+(calculaProdutividade(linhas[posicaoQuantProduzida],linhas[posicaoAreaPlantada]),) + (linhas[posicaoAreaPlantada],)
      for linhas2 in rows2:
        elementoAux = elemento
        if(elemento[0] == linhas2[0]):
          elementoAux = elementoAux + linhas2[1:3]
          lista_tuplas.append(elementoAux)

    return funcoesAux.montaJson(funcoesAux.montaListaJson(lista_tuplas, col))
    
def colocar_certificacoes(rowsAgricultor):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT ac.id_agricultor, ac.id_certificacao, c.nome_certificacao, ac.ano_producao FROM Agricultor_Certificacao ac, Certificacao c where c.id=ac.id_certificacao")
    rowsCertificacoes = cursor.fetchall()
    cnxn.close()

    lista_tuplas=[]
    certificacoes = {}
    for row in rowsCertificacoes:
        id_agricultor = row[0]
        id_certificacao = row[1]
        certificacao = row[2]
        ano = row[3]
        if(not certificacoes.has_key(id_agricultor)):
            certificacoes[id_agricultor] = {}
        if(not certificacoes[id_agricultor].has_key(ano)):
            certificacoes[id_agricultor][ano] = []
        certificacoes[id_agricultor][ano].append({'id_certificacao':id_certificacao,'certificacao':certificacao})

    for row in rowsAgricultor:
        id_agricultor = row[0]
        if(certificacoes.has_key(id_agricultor)):
            certificacoesAgricultor = certificacoes[id_agricultor]
            lista_tuplas.append((certificacoesAgricultor,)+tuple(row))
        else:
            print tuple(row)
            lista_tuplas.append(({},)+tuple(row))

    return lista_tuplas

def info_agricultor(id, ano, esta_logado):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    if esta_logado:
        cursor.execute("SELECT distinct a.id, a.nome_agricultor, c.nome_comunidade, c.nome_cidade, r.nome_regiao, p.area_plantada FROM agricultor a, comunidade c, regiao r, producao p where a.id_comunidade = c.id and r.id = c.id_regiao and a.id = %d and year(p.data_plantio) = %d and a.id = p.id_agricultor" % (id, ano))
        col = ["certificacoes","id", "nome_agricultor","nome_comunidade", "nome_cidade", "nome_regiao", "area"]
    else:
        cursor.execute("SELECT distinct a.id, c.nome_comunidade, c.nome_cidade, r.nome_regiao, p.area_plantada FROM agricultor a, comunidade c, regiao r, producao p where a.id_comunidade = c.id and r.id = c.id_regiao and a.id = %d and year(p.data_plantio) = %d and a.id = p.id_agricultor" % (id, ano))
        col = ["certificacoes","id", "nome_comunidade", "nome_cidade", "nome_regiao", "area"]
    rowsAgricultor = cursor.fetchall()
    cnxn.close()

    return funcoesAux.montaJson(funcoesAux.montaListaJson(colocar_certificacoes(rowsAgricultor), col))




# entidades 

def agricultor_e(id_regiao):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT a.id, a.nome_agricultor, a.sexo, a.ano_adesao, a.variedade_algodao, c.id FROM Agricultor a, Comunidade c WHERE a.id_comunidade = c.id and c.id_regiao=%d" %id_regiao)
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_agricultor", "sexo", "ano_adesao", "variedade_algodao", "id_comunidade"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def comunidades_e(id_regiao):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT nome_comunidade, id FROM Comunidade WHERE id_regiao=%d" %id_regiao)
    rows = cursor.fetchall()
    cnxn.close()

    lista_tuplas = []
    for row in rows:
      lista_tuplas.append(list(row))

    return funcoesAux.montaJson({"comunidade": lista_tuplas})

def atividade_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT atividade, id FROM Atividade")
    rows = cursor.fetchall()
    cnxn.close()

    lista_tuplas = []
    for row in rows:
      lista_tuplas.append(list(row))

    return funcoesAux.montaJson({"atividade": lista_tuplas})

def cultura_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT nome_cultura, id FROM Cultura")
    rows = cursor.fetchall()
    cnxn.close()

    lista_tuplas = []
    for row in rows:
      lista_tuplas.append(list(row))

    return funcoesAux.montaJson({"cultura": lista_tuplas})

def custos_atividade_e(id_regiao, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    # valor default 2013 para coluna ano, resolver isso!!!
    cursor.execute("SELECT c.id, c.id_atividade, c.quantidade, c.valor_unitario, c.area, c.ano FROM Custo_Regiao c WHERE c.id_regiao=%d and c.ano=%d" %(id_regiao,ano))
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "id_atividade", "quantidade_atividade", "valor_unitario", "area", "ano"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def lista_ano_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    #cursor.execute("SELECT ano_producao, ano_producao AS id FROM Ano")
    cursor.execute("SELECT ano_producao, ano_producao AS id FROM Ano")
    rows = cursor.fetchall()
    cnxn.close()

    lista_tuplas = []
    for row in rows:
        lista_tuplas.append(list(row))

    return funcoesAux.montaJson({"ano": lista_tuplas})

def valor_mercado(id_regiao, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    # valor default 2013 para coluna ano, resolver isso!!!
    cursor.execute("SELECT id, id_cultura, valor, ano FROM Valor_Venda WHERE id_regiao=%d and ano=%d" %(id_regiao,ano))
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "id_cultura", "valor_mercado", "ano"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def tecnicas_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM Tecnica")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_tecnica"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def producao_tecnica_agricultor(id_regiao, ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT DISTINCT a.id AS id FROM Agricultor a, Comunidade c, Regiao r, Producao p WHERE a.id_comunidade=c.id AND c.id_regiao=%d AND a.id=p.id_agricultor AND YEAR(p.data_plantio)=%d ORDER BY id" %(id_regiao, ano))
    rowsComProducao = cursor.fetchall()
    cnxn.close()

    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT DISTINCT a.id AS id FROM Agricultor a, Comunidade c, Regiao r, Tecnica_Adotada t WHERE a.id_comunidade=c.id AND c.id_regiao=%d AND a.id=t.id_agricultor AND t.ano=%d ORDER BY id" %(id_regiao, ano))
    rowsComTecnicas = cursor.fetchall()
    cnxn.close()

    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT DISTINCT a.id AS id, a.nome_agricultor AS nome, FALSE AS teve_producao, FALSE AS teve_tecnicas, a.id_comunidade AS id_comunidade FROM Agricultor a, Comunidade c, Regiao r WHERE a.id_comunidade=c.id AND c.id_regiao=%d ORDER BY id" %(id_regiao))
    rowsTodosOsAgricultoresRegiao = cursor.fetchall()
    rows = rowsTodosOsAgricultoresRegiao
    cnxn.close()
    col = ["id", "nome", "teve_producao", "teve_tecnicas", "id_comunidade"]

    todosOsAgricultores = funcoesAux.montaDict(rowsTodosOsAgricultoresRegiao, col, 0)
    
    for idComProducao in rowsComProducao:
        todosOsAgricultores[idComProducao[0]]['teve_producao'] = True

    for idComTecnicas in rowsComTecnicas:
        todosOsAgricultores[idComTecnicas[0]]['teve_tecnicas'] = True

    return funcoesAux.montaJson(todosOsAgricultores.values())

def usuarios():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT * FROM Usuario")
    rows = cursor.fetchall()
    cnxn.close()
    
    return rows


def add_tecnicas_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT id, nome_tecnica FROM Tecnica")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_tecnica"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def add_atividade_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT id, atividade, unidade FROM Atividade")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_atividade_custo", "unidade_atividade_custo"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def add_regiao_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT id, nome_regiao FROM Regiao")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_regiao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def add_culturas_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT id, nome_cultura FROM Cultura")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_cultura"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))

def add_certificados_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT id, nome_certificacao, nome_simplificado_certificacao FROM Certificacao")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_certificacao", "nome_simplificado_certificacao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))


def regiao_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT nome_regiao, id FROM Regiao")
    rows = cursor.fetchall()
    cnxn.close()

    lista_tuplas = []
    for row in rows:
      lista_tuplas.append(list(row))

    return funcoesAux.montaJson({"regiao": lista_tuplas})

def add_comunidade_e():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT id, nome_comunidade, nome_cidade, id_regiao FROM Comunidade")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_comunidade", "nome_cidade", "id_regiao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))
