import csv
import json
import pyodbc

def create_connection():
    return pyodbc.connect("DSN=VerticaDSN")

def disciplinas_por_periodo():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select g.CodigoDisciplina, g.Periodo, d.Nome from GradeDisciplinasPorPeriodo g, Disciplina d where d.CodigoDisciplina = g.CodigoDisciplina and d.Obrigatoria = 1 order by g.Periodo")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["codigo", "periodo", "disciplina"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)


def pre_requisitos():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select * from PreRequisitosDisciplina")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["codigo", "codigoPreRequisito"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)


def maiores_frequencias():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select m.CodigoDisciplina, d.Nome, m.PeriodoMaisFreq1st, m.FreqRelativa1st, m.PeriodoMaisFreq2nd, m.FreqRelativa2nd, m.PeriodoMaisFreq3rd ,m.FreqRelativa3rd, m.TotalDeAlunosPorDisciplina from MaioresFrequenciasPorDisciplina m, Disciplina d where d.CodigoDisciplina = m.CodigoDisciplina and d.Obrigatoria = 1 order by m.PeriodoMaisFreq1st")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["codigo", "disciplina", "periodoMaisFreq1st", "freqRelativa1st", "periodoMaisFreq2nd", "freqRelativa2nd", "periodoMaisFreq3rd", "freqRelativa3rd", "totalDeAlunos"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)

def reprovacoes():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select d.Nome, r.CodigoDisciplina, r.ReprovacaoAbsoluta, r.ReprovacaoRelativa, r.TotalDeAlunos from Disciplina d, Reprovacoes r where r.CodigoDisciplina = d.CodigoDisciplina and d.Obrigatoria = 1")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["disciplina", "codigo", "reprovacaoAbsoluta", "reprovacaoRelativa", "totalDeAlunos"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)

def correlacoes(valor):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select d1.Nome, c.CodDisciplina1, d2.Nome, c.CodDisciplina2, c.Correlacao from  CorrelacaoDisciplinasPorNotas c, Disciplina d1, Disciplina d2 where d1.CodigoDisciplina = c.CodDisciplina1 and d2.CodigoDisciplina = c.CodDisciplina2 and d1.Obrigatoria = 1 and d2.Obrigatoria = 1 and (c.Correlacao >= %f or c.Correlacao <= %f)" % (valor, -valor))
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["disciplina1", "codigo1", "disciplina2", "codigo2", "correlacao"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)

def info_clusters():
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select * from InfoClusters order by Cluster")
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["cluster", "rotulo", "descricao"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)

def clusters(numero_cluster):
    cnxn = create_connection()
    cursor = cnxn.cursor()
    cursor.execute("select d.Nome, c.CodigoDisciplina, c.Periodo, c.Cluster from Clusters c, Disciplina d where c.CodigoDisciplina = d.CodigoDisciplina and d.Obrigatoria = 1 and c.Cluster = %d order by c.Cluster, c.Periodo" % (numero_cluster))
    rows = cursor.fetchall()
    cnxn.close()
    lista_tuplas = []
    for tupla in rows:
       lista_tuplas.append(tupla)
    col = ["disciplina","codigo", "periodo", "cluster"]
    response = montaJson(lista_tuplas, col)
    return json.dumps(response)



def montaJson(spamreader, col):
	response = []
	colunas = col
	i = 0
	for row in spamreader:
		celulas = {}
		for indexColumns in range(0,len(colunas)):
			celulas[colunas[indexColumns]] = row[indexColumns]
		response.append(celulas)
		i = i + 1;
	return response
