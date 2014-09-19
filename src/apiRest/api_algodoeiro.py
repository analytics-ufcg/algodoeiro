## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-
from flask import Flask, make_response, request, redirect, Response
from crossdomain import crossdomain
import dadosApiRestRegiao, dadosApiRestAgricultor,dadosApiRestInsercao, json, insert_update_BD

app = Flask(__name__)

######## Autenticacao
def verifica_logado(usuario, senha):
	return usuario == "admin" and senha == "admin"

@app.route('/login/<usuario>/<senha>')
def loginAdmin(usuario, senha):
    response = "[{"+'"usuario"'+': '+ '"'+str(verifica_logado(usuario, senha)) +'"' +"}]"
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

######################

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

@app.route('/agricultor/producao/<ano>/<usuario>/<senha>')
def producao_agricultores(ano, usuario, senha):
	response = dadosApiRestAgricultor.producao_agricultores(int(ano), verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/receita/<ano>/<usuario>/<senha>')
def receita(ano, usuario, senha):
	response = dadosApiRestAgricultor.receita_agricultor(int(ano), verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/lucro/<ano>/<usuario>/<senha>')
def lucro(ano, usuario, senha):
	response = dadosApiRestAgricultor.lucro_agricultor(int(ano), verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/produtividade/<ano>/<usuario>/<senha>')
def agricultor_produtividade(ano, usuario, senha):
	response = dadosApiRestAgricultor.produtividade_agricultores(int(ano), verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/cultura/<ano>/<usuario>/<senha>')
def culturas_por_agricultor(ano, usuario, senha):
	response = dadosApiRestAgricultor.culturas_por_agricultor(int(ano), verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response


@app.route('/agricultor/tecnica/<ano>/<usuario>/<senha>')
def tecnica_agricultores(ano, usuario, senha):
	response = dadosApiRestAgricultor.tecnica_agricultores(int(ano), verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultores/<usuario>/<senha>')
def agricultores(usuario, senha):
	response = dadosApiRestAgricultor.agricultores(verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/produtores/<usuario>/<senha>')
def agricultores_com_producao(usuario,senha):
	response = dadosApiRestAgricultor.agricultores_com_producao(verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/produtores/algodao/<usuario>/<senha>')
def produtores_algodao(usuario, senha):
	response = dadosApiRestAgricultor.produtores_algodao(verifica_logado(usuario, senha))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultor/<id>/<ano>/<usuario>/<senha>')
def info_agricultor(id, ano, usuario, senha):
	response = dadosApiRestAgricultor.info_agricultor(int(id), int(ano), verifica_logado(usuario, senha))
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

@app.route('/producao_e/<id>/<ano>')
def producoes_e(id, ano):
	response = dadosApiRestInsercao.producoes_e(int(id), int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/adiciona_producao', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def adiciona_producao():
	dados = json.loads(request.data)
	# CUIDADO, MODIFICA O BD ORIGINAL
	response = insert_update_BD.producao(dados)

#	if(response == "true"):
#		response = make_response('true',200)
#	else:
#		response = make_response('false',500)

	return ""

@app.route('/tratortem')
def tratortem():
    response = make_response("<h1>RODA GRANDE!</h1>")
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

@app.route('/adicionarAno')
def adicionarAno():
    response = insert_update_BD.adicionarAno()
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

@app.route('/producao_tec_e/<id>/<ano>', methods=['GET'])
def producao_tec_e(id, ano):
	response = dadosApiRestInsercao.producoes_e(int(id), int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/producao_tec_e/<id_agricultor>/<ano>/<id>', methods=['HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_producao_tec_e(id_agricultor, ano,id):
   	dados = json.loads(request.data)

	response = dadosApiRestInsercao.atualizar_producoes(dados, int(id_agricultor), int(ano))
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response


@app.route('/tecnica_e/<id>/<ano>', methods=['GET'])
def tecnica_e(id, ano):
	response = dadosApiRestInsercao.tecnicas_e(int(id), int(ano))
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/tecnica_e/<id_agricultor>/<ano>/<id>', methods=['HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_tecnica_e(id_agricultor, ano,id):
   	dados = json.loads(request.data)

	response = dadosApiRestInsercao.editar_tecnica(dados, int(id_agricultor), int(ano))
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/editaAreaProducao/<id_agricultor>/<ano>', methods=['HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_area_produdao_e(id_agricultor, ano):
   	dados = json.loads(request.data)
	response = dadosApiRestInsercao.update_area_produdao_e(dados, int(id_agricultor), int(ano))
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/regiao_e')
def regiao_e():
    response = dadosApiRestAgricultor.regiao_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/addComunidade_e')
def add_comunidade_e():
    response = dadosApiRestAgricultor.add_comunidade_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/addComunidade_e/<id>', methods=['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'OPTIONS'])
@crossdomain(origin='*')
def update_add_comunidade_e(id):
	dados = json.loads(request.data)
	response = insert_update_BD.update_add_comunidade_e(dados["id"], dados["nome_comunidade"], dados["nome_cidade"], dados["id_regiao"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/removeComunidade', methods=['GET','POST', 'DELETE', 'OPTIONS'])
@crossdomain(origin='*')
def remove_add_comunidade_e():
	dados = json.loads(request.data)
	response = insert_update_BD.remove_add_comunidade_e(dados["id"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

@app.route('/adicionaComunidade', methods=['GET', 'POST', 'OPTIONS'])
@crossdomain(origin='*')
def insert_add_comunidade_e():
	dados = json.loads(request.data)
	response = insert_update_BD.insert_add_comunidade_e(dados["nome_comunidade"], dados["nome_cidade"], dados["regiao_com"])
	if(response == "true"):
		response = make_response('true',200)
	else:
		response = make_response('false',500)
	return response

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
