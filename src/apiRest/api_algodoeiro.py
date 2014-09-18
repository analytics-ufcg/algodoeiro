## Essa linha de codigo abaixo(comentario) foi colocada para dizer a codificacao do python, se retirar ele quebra
# -*- coding: utf-8 -*-
from flask import Flask, make_response, request, redirect, Response
from crossdomain import crossdomain
from auth import Login
import dadosApiRestRegiao, dadosApiRestAgricultor,dadosApiRestInsercao, json, insert_update_BD
from functools import wraps

app = Flask(__name__)

######## Autenticacao
def verifica_logado(usuario, senha):
	return usuario == "admin" and senha == "admin"

@app.route('/login/<usuario>/<senha>')
def loginAdmin(usuario, senha):
    response = "[{"+'"usuario"'+': '+ '"'+str(usuario == "admin" and senha == "admin") +'"' +"}]"
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

@app.route('/regiao/custo/total')
def custo_total_por_regiao():
	response = dadosApiRestRegiao.custo_total_regiao()
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
def agricultor_e_update(id_regiao, id):
	dados = json.loads(request.data)
	for key in dados.keys():
		print(key)
		print(dados[key])
	# CUIDADO, MODIFICA O BD ORIGINAL
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
	for key in dados.keys():
		print(key)
		print(dados[key])
	# CUIDADO, MODIFICA O BD ORIGINAL
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
	for key in dados.keys():
		print(key)
		print(dados[key])
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

@app.route('/lista_ano_e')
def lista_ano_e():
    response = dadosApiRestAgricultor.lista_ano_e()
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/custos_atividade_e/<id_regiao>')
def custos_atividade_e(id_regiao):
    response = dadosApiRestAgricultor.custos_atividade_e(int(id_regiao))
    response = make_response(response)
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response

@app.route('/comunidades_e/<id_regiao>')
@crossdomain(origin='*')
def comunidades_e(id_regiao):
        response = dadosApiRestAgricultor.comunidades_e(int(id_regiao))
        response = make_response(response)
        response.headers['Access-Control-Allow-Origin'] = "*"
        return response
 

@app.route('/usuarios')
def usuarios():
        response = dadosApiRestAgricultor.usuarios()
        response = make_response(response)
        response.headers['Access-Control-Allow-Origin'] = "*"
        return response


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
