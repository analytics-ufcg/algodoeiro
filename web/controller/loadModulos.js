var alreadyLoad = {
		balanco : false,
		producao : false,
		produtividade : false
	}

function loadHome(){
	toogleVisib('home');
}

function loadBalanco(){
	if (!alreadyLoad.balanco){
		loadDropDownBalanco();

		alreadyLoad.balanco = true;
	}
	toogleVisib('financas');
}

function loadProducao(){
	if (!alreadyLoad.producao){
		loadDropDownProducaoRegiao();
		loadDropDownProducaoAgricultores();

		alreadyLoad.producao = true;
	}
	toogleVisib('producao');
}

function loadProdutividade(){
	if (!alreadyLoad.produtividade){
		loadDropDownProdutividadeAgricultores();
		loadDropDownProdutividadeTecnicas();

		alreadyLoad.produtividade = true;
	}
	toogleVisib('produtividade');
}

function loadAnalises(){
	toogleVisib('analises');
}