import json
import pyodbc
import collections
import operator
import dadosApiRestRegiao
import funcoesAux

def create_connection():
    return pyodbc.connect("DSN=AlgodoeiroDSN")

def agricultores():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao from agricultor a, comunidade c, regiao r where a.id_comunidade = c.id and r.id = c.id_regiao order by id")
    rowsAgricultor = cursor.fetchall()
    cnxn.close()

    col = ["certificacoes","id", "nome_agricultor","id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(colocar_certificacoes(rowsAgricultor), col))

def agricultores_com_producao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select distinct a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao from agricultor a, comunidade c, regiao r, Producao p where a.id_comunidade = c.id and r.id = c.id_regiao and p.id_agricultor=a.id and p.quantidade_produzida > 0 order by id")
    rows = cursor.fetchall()
    cnxn.close()

    col = ["certificacoes","id", "nome_agricultor","id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(colocar_certificacoes(rows), col))

def produtores_algodao():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select distinct a.id, a.nome_agricultor, a.id_comunidade, c.nome_comunidade, c.nome_cidade, c.id_regiao, r.nome_regiao from agricultor a, comunidade c, regiao r, Producao p where a.id_comunidade = c.id and r.id = c.id_regiao and p.id_agricultor=a.id and p.quantidade_produzida > 0 and p.id_cultura=1 order by id")
    rows = cursor.fetchall()
    cnxn.close()

    col = ["certificacoes","id", "nome_agricultor","id_comunidade","nome_comunidade", "nome_cidade", "id_regiao", "nome_regiao"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(colocar_certificacoes(rows), col))

def producao_agricultores(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select a.id as id_agricultor, c.nome_cultura, c.id as id_cultura, sum(p.quantidade_produzida), p.area_plantada as area from Agricultor a, Producao p, Cultura c where a.id = p.id_agricultor and c.id=p.id_cultura and year(p.data_plantio) = %d and p.id_agricultor = a.id group by a.id, c.id, c.nome_cultura, p.area_plantada order by a.id" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    col = ["id_agricultor", "nome_cultura","id_cultura","producao", "area"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(rows, col))


def receita_agricultor(ano):
    col = ["id_agricultor", "nome_regiao", "nome_agricultor", "receita"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(receita_aux(ano), col))

def receita_aux(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT a.id, r.nome_regiao, a.nome_agricultor, SUM(p.quantidade_produzida*v.valor), p.area_plantada FROM Regiao r, Producao p, Venda v, Agricultor a, Comunidade c where r.id=v.id_regiao and p.id_cultura=v.id_cultura and year(p.data_plantio)=%d and a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id group by a.id, r.nome_regiao, a.nome_agricultor, p.area_plantada" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    
    lista_tuplas = []
    for linhas in rows:
# Essa parte comentada se for precisar descomentar precisa ajustar os valores
#       if (linhas[3] is None):
#          if (linhas[0]== "Apodi"):
#             elemento = linhas[0:2]+(round(linhas[2]/1.9,2),)
#          if (linhas[0]== "Cariri"):
#             elemento = linhas[0:2]+(round(linhas[2]/1.97,2),)
#          if (linhas[0]== "Pajeu"):
#             elemento = linhas[0:2]+(round(linhas[2]/0.97,2),)
#       else:
       elemento = linhas[0:3]+(round(linhas[3]/linhas[4],2),)
       lista_tuplas.append(elemento)
    return lista_tuplas

def lucro_agricultor(ano):
    rec = receita_aux(ano)
    cust = dadosApiRestRegiao.custo_aux()
    lista_tuplas = []
    for receitas in rec:
        for custos in cust:
            if (receitas[1] == custos[0]):
               lista_tuplas.append(receitas[0:3]+(round(receitas[3]-custos[1],2),))
    col = ["id_agricultor","nome_regiao", "nome_agricultor", "lucro"]
    return funcoesAux.montaJson(funcoesAux.montaListaJson(lista_tuplas, col))

def produtividade_agricultores(ano):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("SELECT a.id, r.id, r.nome_regiao, a.nome_agricultor, p.quantidade_produzida, p.area_plantada FROM Regiao r, Producao p, Agricultor a, Comunidade c where year(p.data_plantio)=%d and a.id_comunidade=c.id and p.id_agricultor=a.id and c.id_regiao=r.id and p.id_cultura=1" % ano)
    rows = cursor.fetchall()
    cnxn.close()
    
#    lista_tuplas = []
#    for linhas in rows:
# Essa parte comentada se for precisar descomentar precisa ajustar os valores
#       if (linhas[3] is None):
#          if (linhas[0]== "Apodi"):
#             elemento = linhas[0:2]+(round(linhas[2]/(1.9*0.5),2),)
#          if (linhas[0]== "Cariri"):
#             elemento = linhas[0:2]+(round(linhas[2]/(1.97*0.5),2),)
#          if (linhas[0]== "Pajeu"):
#             elemento = linhas[0:2]+(round(linhas[2]/(0.97*0.5),2),)
#       else:
#       elemento = linhas[0:4]+(round(linhas[4]/(linhas[5]*0.5),2),)+ (linhas[5],)
#       lista_tuplas.append(elemento)
    posicaoQuantProduzida = 4
    posicaoAreaPlantada = 5
    col = ["id_agricultor","id_regiao","nome_regiao", "nome_agricultor", "produtividade", "area_plantada"]
    lista_tuplas = []
    for linhas in rows:
       elemento = linhas[0:posicaoQuantProduzida]+calculaProdutividade(linhas[posicaoQuantProduzida],linhas[posicaoAreaPlantada]) + (linhas[posicaoAreaPlantada],)
       lista_tuplas.append(elemento)
    return funcoesAux.montaJson(funcoesAux.montaListaJson(lista_tuplas, col))

def tecnica_agricultores():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    #Seleciona informacoes de agricultor e da produtividade
    cursor.execute("select a.id, a.nome_agricultor, r.id, r.nome_regiao, co.nome_comunidade, co.nome_cidade, p.quantidade_produzida, p.area_plantada from Agricultor a, Comunidade co, Regiao r, Producao p where a.id_comunidade=co.id and co.id_regiao=r.id and p.id_agricultor = a.id and p.id_cultura=1")
    rowsAgricultor = cursor.fetchall()

    cursor2 = cnxn.cursor()
    #Seleciona informacoes das tecnicas
    cursor2.execute("select a.id, t.id, t.nome_tecnica, ta.ano from Agricultor a, Tecnica t, Tecnica_Adotada ta where a.id = ta.id_agricultor and ta.id_tecnica=t.id")
    rowsTecnicas = cursor2.fetchall()

    cnxn.close()

    lista_tuplas=[]
    tecnicas = {}
    for row in rowsTecnicas:
       id_agricultor = row[0]
       id_tecnica = row[1]
       tecnica = row[2]
       ano = row[3]
       if(not tecnicas.has_key(id_agricultor)):
          tecnicas[id_agricultor] = {}
       if(not tecnicas[id_agricultor].has_key(ano)):
          tecnicas[id_agricultor][ano] = []
       tecnicas[id_agricultor][ano].append({'id':id_tecnica,'tecnica':tecnica})

    for row in rowsAgricultor:
       id_agricultor = row[0]
       if(tecnicas.has_key(id_agricultor)):
          tecnicasAgricultor = tecnicas[id_agricultor]
          lista_tuplas.append((tecnicasAgricultor,)+tuple(row))

    col = ["tecnicas","id_agricultor","nome_agricultor", "id_regiao", "nome_regiao", "nome_comunidade", "nome_cidade", "produtividade", "area_plantada"]
    posicaoQuantProduzida = 7
    posicaoAreaPlantada = 8
    lista_tuplas_aux = []
    for linhas in lista_tuplas:
       elemento = linhas[0:posicaoQuantProduzida]+calculaProdutividade(linhas[posicaoQuantProduzida],(linhas[posicaoAreaPlantada])) + (linhas[posicaoAreaPlantada],)
       lista_tuplas_aux.append(elemento)

    return funcoesAux.montaJson(funcoesAux.montaListaJson(lista_tuplas_aux, col))

#Quantidade produzida e area plantada devem ser os ultimos parametros do select e devem estar nessa ordem.
def calculaProdutividade(producao,area):
    return (round(producao/area*0.5),2)

def colocar_certificacoes(rowsAgricultor):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select ac.id_agricultor, ac.id_certificacao, c.nome_certificacao, ac.ano_producao from Agricultor_Certificacao ac, Certificacao c where c.id=ac.id_certificacao")
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

    return lista_tuplas