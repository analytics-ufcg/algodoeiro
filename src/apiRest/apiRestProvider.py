from flask import Flask, make_response
import dadosApiRest

app = Flask(__name__)

@app.route('/regiao')
def regiao():
	response = dadosApiRest.regiao()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/comunidade')
def comunidade():
	response = dadosApiRest.comunidade()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/cultura')
def cultura():
	response = dadosApiRest.cultura()
	response = make_response(response)
	response.headers['Access-Control-Allow-Origin'] = "*"
	return response

@app.route('/produtividade_agricultor')
def produtividade_agricultor():
	response = dadosApiRest.produtividade_agricultor()
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
