import csv
import json
import pyodbc

def create_connection():
    return pyodbc.connect("DSN=VerticaDSN")

def tipos_de_producao():
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
