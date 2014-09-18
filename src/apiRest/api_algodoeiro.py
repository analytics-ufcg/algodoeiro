## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-
from flask import Flask, make_response, request
from crossdomain import crossdomain
import dadosApiRestRegiao, dadosApiRestAgricultor, json, insert_update_BD

app = Flask(__name__)

@app.route('/regioes')
def regiao():
	response = dadosApiRestRegiao.regiao()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/regiao/producao/media/<ano>')
def media_producao_regiao(ano):
	response = dadosApiRestRegiao.media_producao_regiao(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/regiao/producao/<ano>')
def producao_regiao(ano):
	response = dadosApiRestRegiao.producao_regiao(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/regiao/custo/total/<ano>')
def custo_total_por_regiao(ano):
	response = dadosApiRestRegiao.custo_total_regiao(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/anos')
def anos():
	response = dadosApiRestRegiao.anos()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/producao/<ano>')
def producao_agricultores(ano):
	response = dadosApiRestAgricultor.producao_agricultores(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/receita/<ano>')
def receita(ano):
	response = dadosApiRestAgricultor.receita_agricultor(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/lucro/<ano>')
def lucro(ano):
	response = dadosApiRestAgricultor.lucro_agricultor(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/produtividade/<ano>')
def agricultor_produtividade(ano):
	response = dadosApiRestAgricultor.produtividade_agricultores(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/cultura/<ano>')
def culturas_por_agricultor(ano):
	response = dadosApiRestAgricultor.culturas_por_agricultor(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response


@app.route('/agricultor/tecnica/<ano>')
def tecnica_agricultores(ano):
	response = dadosApiRestAgricultor.tecnica_agricultores(int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultores')
def agricultores():
	response = dadosApiRestAgricultor.agricultores()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/produtores')
def agricultores_com_producao():
	response = dadosApiRestAgricultor.agricultores_com_producao()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/produtores/algodao')
def produtores_algodao():
	response = dadosApiRestAgricultor.produtores_algodao()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/<id>/<ano>')
def info_agricultor(id, ano):
	response = dadosApiRestAgricultor.info_agricultor(int(id), int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor_e/<id_regiao>')
def agricultor_e(id_regiao):
    response = dadosApiRestAgricultor.agricultor_e(int(id_regiao))
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/agricultor_e/<id_regiao>/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_agricultor_e(id_regiao, id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_Agricultor(dados["id"], dados["nome_agricultor"], dados["sexo"], dados["ano_adesao"], dados["variedade_algodao"], dados["id_comunidade"])
	
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)

	return response

@app.route('/adicionaAgricultor/<id_regiao>', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def adiciona_agricultor(id_regiao):
	dados = json.loads(request.data)
	response = insert_update_BD.insert_Agricultor(dados["nome_agricultor"], dados["sexo"],dados["comunidade"], dados["ano_adesao"], dados["variedade_algodao"])

	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)

	return response

@app.route('/removeAgricultor/<id_regiao>', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_agricultor(id_regiao):
	dados = json.loads(request.data)
	response = insert_update_BD.remove_Agricultor(dados["id"])

	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)

	return response

@app.route('/tecnicas_e')
def tecnicas_e():
    response = dadosApiRestAgricultor.tecnicas_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/atividade_e')
def atividade_e():
    response = dadosApiRestAgricultor.atividade_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/cultura_e')
def cultura_e():
    response = dadosApiRestAgricultor.cultura_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/lista_ano_e')
def lista_ano_e():
    response = dadosApiRestAgricultor.lista_ano_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/custos_atividade_e/<id_regiao>/<ano>')
def custos_atividade_e(id_regiao,ano):
    response = dadosApiRestAgricultor.custos_atividade_e(int(id_regiao), int(ano))
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/custos_atividade_e/<id_regiao>/<ano>/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_custos_atividade_e(id_regiao, ano, id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_custos_atividade(dados["id"], dados["id_atividade"],dados["valor_unitario"],dados["quantidade_atividade"], dados["ano"])
	
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)

	return response

@app.route('/removeAtividade/<id_regiao>/<ano>', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_atividade(id_regiao, ano):
	dados = json.loads(request.data)
	response = insert_update_BD.remove_Atividade(dados["id"])

	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/adicionaAtividade/<id_regiao>/<ano>', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def adiciona_atividade(id_regiao,ano):
	dados = json.loads(request.data)
	response = insert_update_BD.insert_Atividade(dados["valor_atividade"], dados["quantidade_atividade"],dados["atividade_custo"],int(id_regiao), int(ano))
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/updateAreaAtividade/<id_regiao>/<ano>', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def update_area_atividade(id_regiao, ano):
	dados = json.loads(request.data)
	response = insert_update_BD.update_area_Atividade(dados["area"],int(id_regiao), int(ano))
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/valor_mercado/<id_regiao>/<ano>')
def valor_mercado(id_regiao,ano):
    response = dadosApiRestAgricultor.valor_mercado(int(id_regiao), int(ano))
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/valor_mercado/<id_regiao>/<ano>/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_valor_mercado(id_regiao, ano, id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_valor_mercado(dados["id"], dados["id_cultura"],dados["valor_mercado"], dados["ano"])

	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)

	return response

@app.route('/removeValorMercado/<id_regiao>/<ano>', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_valor_mercado(id_regiao, ano):
	dados = json.loads(request.data)
	response = insert_update_BD.remove_valor_mercado(dados["id"])

	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/adicionarValorMercado/<id_regiao>/<ano>', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def insert_valor_mercado(id_regiao,ano):
	dados = json.loads(request.data)
	response = insert_update_BD.insert_valor_mercado(dados["cultura_valor_mercado"],dados["valor_mercado"],int(id_regiao), int(ano))
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/comunidades_e/<id_regiao>')
@crossdomain(origin='*')
def comunidades_e(id_regiao):
    response = dadosApiRestAgricultor.comunidades_e(int(id_regiao))
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/producao_tecnica_agricultor/<id_regiao>/<ano>')
def producao_tecnica_agricultor(id_regiao, ano):
    response = dadosApiRestAgricultor.producao_tecnica_agricultor(int(id_regiao), int(ano))
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/usuarios')
def usuarios():
    response = dadosApiRestAgricultor.usuarios()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/addTecnicas')
def add_tecnicas_e():
    response = dadosApiRestAgricultor.add_tecnicas_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/addTecnicas/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_add_tecnicas_e(id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_add_tecnicas_e(dados["id"], dados["nome_tecnica"])
	
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/removeTecnica', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_add_tecnicas_e():
	dados = json.loads(request.data)
	response = insert_update_BD.remove_add_tecnicas_e(dados["id"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)

	return response

@app.route('/adicionaTecnica', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def insert_add_tecnicas_e():
	dados = json.loads(request.data)
	response = insert_update_BD.insert_add_tecnicas_e(dados["nome_tecnica_add"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/addAtividade_e')
def add_atividade_e():
    response = dadosApiRestAgricultor.add_atividade_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/addAtividade_e/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_add_atividade_e(id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_add_atividade_e(dados["id"], dados["nome_atividade_custo"], dados["unidade_atividade_custo"])
	
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/removeAtividadeCusto', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_add_atividade_e():
	dados = json.loads(request.data)
	response = insert_update_BD.remove_add_atividade_e(dados["id"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)

	return response

@app.route('/adicionaAtividadeCusto', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def insert_add_atividade_e():
	dados = json.loads(request.data)
	response = insert_update_BD.insert_add_atividade_e(dados["nome_atividade_custo_add"], dados["unidade_atividade_custo_add"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/AddRegioes')
def add_regiao_e():
    response = dadosApiRestAgricultor.add_regiao_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/AddRegioes/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_add_regiao_e(id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_add_regiao_e(dados["id"], dados["nome_regiao"])
	
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/removeRegiao', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_add_regiao_e():
	dados = json.loads(request.data)
	response = insert_update_BD.remove_add_regiao_e(dados["id"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)

	return response

@app.route('/adicionaRegiao', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def insert_add_regiao_e():
	dados = json.loads(request.data)
	response = insert_update_BD.insert_add_regiao_e(dados["nome_regiao_add"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response


@app.route('/addCulturas')
def add_culturas_e():
	response = dadosApiRestAgricultor.add_culturas_e()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/addCulturas/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_add_culturas_e(id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_add_culturas_e(dados["id"], dados["nome_cultura"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/removeCultura', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_add_culturas_e():
	dados = json.loads(request.data)
	response = insert_update_BD.remove_add_culturas_e(dados["id"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/adicionaCultura', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def insert_add_culturas_e():
	dados = json.loads(request.data)
	response = insert_update_BD.insert_add_culturas_e(dados["nome_cultura_add"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response


@app.route('/AddCertificados')
def add_certificados_e():
	response = dadosApiRestAgricultor.add_certificados_e()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/AddCertificados/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_add_certificados_e(id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_add_certificados_e(dados["id"], dados["nome_certificacao"], dados["nome_simplificado_certificacao"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/removeCertificado', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_add_certificados_e():
	dados = json.loads(request.data)
	response = insert_update_BD.remove_add_certificados_e(dados["id"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/adicionaCertificado', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def insert_add_certificados_e():
	dados = json.loads(request.data)
	response = insert_update_BD.insert_add_certificados_e(dados["nome_certificado_add"], dados["nome_simplificado_certificacao_add"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
