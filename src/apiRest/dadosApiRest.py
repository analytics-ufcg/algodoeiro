import csv
import json
import pyodbc
import datetime
from time import mktime
import collections
import operator

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")

def regiao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select * from Regiao")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "regiao"]
    return montaJson(montaListaJson(rows, col))

def agricultores():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao from agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and r.id = c.id_regiao order by id")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_agricultor","id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    return montaJson(montaListaJson(rows, col))

def agricultores_com_producao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select distinct a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao from agricultor a, comunidade c, regiao r, Producao p where a.id_comunidade = c.id and r.id = c.id_regiao and p.id_agricultor=a.id and p.quantidade_produzida > 0 order by id")
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id", "nome_agricultor","id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    return montaJson(montaListaJson(rows, col))

def media_producao_regiao(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select r.id as id_regiao, r.nome_regiao, cu.id as id_cultura , cu.nome_cultura, avg(p.quantidade_produzida) as media_producao from Cultura cu, Producao p, Agricultor a, Comunidade c, Regiao r where year(p.data_plantio) = %d and cu.id = p.id_cultura and p.id_agricultor = a.id and a.id_comunidade = c.id and c.id_regiao = r.id and p.quantidade_produzida > 0 group by r.id,r.nome_regiao, cu.id, cu.nome_cultura order by r.id, cu.id" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id_regiao", "nome_regiao","id_cultura","nome_cultura","producao"]
    return montaJson(montaListaJson(rows, col))

def producao_agricultores(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select a.id as id_agricultor, c.nome_cultura, c.id as id_cultura, sum(p.quantidade_produzida), p.area_plantada as area from Agricultor a, Producao p, Cultura c where a.id = p.id_agricultor and c.id=p.id_cultura and year(p.data_plantio) = %d and p.id_agricultor = a.id group by a.id, c.id, c.nome_cultura, p.area_plantada order by a.id" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id_agricultor", "nome_cultura","id_cultura","producao", "area"]
    return montaJson(montaListaJson(rows, col))

def producao_regiao(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    # visualizacao da producao de uma regiao, exibidas as seguintes informacoes no grafico:
    # area total de plantio de cada cultura, as quantidades produzidas, o nome das culturas, data plantio

    cursor.execute("select r.nome_regiao, cu.nome_cultura,  sum(p.quantidade_produzida) from Producao p, Agricultor a, Comunidade c, Regiao r, Cultura cu where p.id_agricultor=a.id and a.id_comunidade=c.id and  cu.id=p.id_cultura and r.id=c.id_regiao and year(p.data_plantio)=%d group by r.nome_regiao, cu.nome_cultura order by r.nome_regiao" % ano)
    regiao_rows = cursor.fetchall()
    cnxn.close()

    return montaJson(montaListaJsonRegiao(regiao_rows),True)


def custo_total_regiao():
    col = ["nome_regiao", "total"]
    return '{"Regioes":' + montaJson(montaListaJson(custo_aux(), col)) + '}'


def receita_agricultor(ano):
    col = ["nome_regiao", "nome_agricultor", "receita"]
    return montaJson(montaListaJson(receita_aux(ano), col))

def custo_aux():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT r.nome_regiao, SUM(c.quantidade*c.valor_unitario), c.area FROM Custo c, Regiao r where r.id = c.id_regiao group by r.nome_regiao, c.area")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for linhas in rows:
       lista_tuplas.append((linhas[0],round(linhas[1]/linhas[2],2),))
    return lista_tuplas

def receita_aux(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT r.nome_regiao, a.nome_agricultor, SUM(p.quantidade_produzida*v.valor), p.area_plantada FROM Regiao r, Producao p, Venda v, Agricultor a, Comunidade c where r.id=v.id_regiao and p.id_cultura=v.id_cultura and year(p.data_plantio)=%d and a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id group by r.nome_regiao, a.nome_agricultor, p.area_plantada" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    
    lista_tuplas = []
    for linhas in rows:
       if (linhas[3] is None):
          if (linhas[0]== "Apodi"):
             elemento = linhas[0:2]+(round(linhas[2]/1.9,2),)
          if (linhas[0]== "Cariri"):
             elemento = linhas[0:2]+(round(linhas[2]/1.97,2),)
          if (linhas[0]== "Pajeu"):
             elemento = linhas[0:2]+(round(linhas[2]/0.97,2),)
       else:
            elemento = linhas[0:2]+(round(linhas[2]/linhas[3],2),)
       lista_tuplas.append(elemento)
    return lista_tuplas

def lucro_agricultor(ano):
    rec = receita_aux(ano)
    cust = custo_aux()
    lista_tuplas = []
    for receitas in rec:
        for custos in cust:
            if (receitas[0] == custos[0]):
               lista_tuplas.append(receitas[0:2]+(round(receitas[2]-custos[1],2),))
    col = ["nome_regiao", "nome_agricultor", "lucro"]
    return montaJson(montaListaJson(lista_tuplas, col))

def produtividade_agricultores(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT a.id, r.nome_regiao, a.nome_agricultor, p.quantidade_produzida, p.area_plantada FROM Regiao r, Producao p, Agricultor a, Comunidade c where year(p.data_plantio)=%d and a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id and p.id_cultura=1" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    
    lista_tuplas = []
    for linhas in rows:
       if (linhas[3] is None):
          if (linhas[0]== "Apodi"):
             elemento = linhas[0:2]+(round(linhas[2]/(1.9*0.5),2),)
          if (linhas[0]== "Cariri"):
             elemento = linhas[0:2]+(round(linhas[2]/(1.97*0.5),2),)
          if (linhas[0]== "Pajeu"):
             elemento = linhas[0:2]+(round(linhas[2]/(0.97*0.5),2),)
       else:
            elemento = linhas[0:2]+(round(linhas[2]/(linhas[3]*0.5),2),)
       lista_tuplas.append(elemento)
    col = ["nome_regiao", "nome_agricultor", "produtividade"]
    return montaJson(montaListaJson(lista_tuplas, col))

def tecnica_agricultores(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select a.id, a.nome_agricultor, t.nome_tecnica, ta.ano from Agricultor a, Tecnica t, Tecnica_Adotada ta where a.id = ta.id_agricultor and ta.id_tecnica=t.id and ta.ano=%d" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    col = ["nome_agricultor", "nome_tecnica","ano"]
    return montaJson(montaListaJson(rows, col))


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

def montaListaJson(spamreader, col):
	response = []
	colunas = col
	for row in spamreader:
		celulas = {}
		for indexColumns in range(0,len(colunas)):
			celulas[colunas[indexColumns]] = row[indexColumns]
		response.append(celulas)
	return response

def montaJson(response,sorted = False):
	return json.dumps(response,sort_keys=sorted,default=date_handler).encode('utf8')

def date_handler(obj):
    return obj.isoformat() if hasattr(obj, 'isoformat') else obj


