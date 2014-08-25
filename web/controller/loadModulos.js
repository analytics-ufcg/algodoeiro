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
		$("#main").scrollTop(0);
		loadDropDownBalanco();
		
		alreadyLoad.balanco = true;
	}
	
	toogleVisib('financas');
}

function loadProducao(){
	if (!alreadyLoad.producao){
		$("#main").scrollTop(0);
		loadDropDownProducaoRegiao();
		loadDropDownProducaoAgricultores();

		alreadyLoad.producao = true;
	}
	toogleVisib('producao');
}

function loadProdutividade(){
	if (!alreadyLoad.produtividade){
		$("#main").scrollTop(0);
		loadDropDownProdutividadeAgricultores();
		loadDropDownProdutividadeTecnicas();

		alreadyLoad.produtividade = true;
	}
	toogleVisib('produtividade');
}

function loadAnalises(){
	toogleVisib('analises');
}