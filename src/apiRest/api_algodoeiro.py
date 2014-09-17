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
def anos():
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
