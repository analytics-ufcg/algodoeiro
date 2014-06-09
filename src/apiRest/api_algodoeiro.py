from flask import Flask, make_response
import dadosApiRest

app = Flask(__name__)

@app.route('/regioes')
def regiao():
	response = dadosApiRest.regiao()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/comunidades')
def comunidade():
	response = dadosApiRest.comunidade()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/culturas')
def cultura():
	response = dadosApiRest.cultura()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/agricultores')
def agricultores():
	response = dadosApiRest.agricultores()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/produtividade_dos_agricultores')
def produtividade_agricultores():
	response = dadosApiRest.produtividade_agricultores()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/produtividade_agricultor/<int:id_agricultor>')
def produtividade_agricultor(id_agricultor):
	response = dadosApiRest.produtividade_agricultor(id_agricultor)
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/produtividade_regiao')
def produtividade_regiao():
	response = dadosApiRest.produtividade_regiao()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5001)
