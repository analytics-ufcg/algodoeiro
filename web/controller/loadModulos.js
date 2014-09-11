var alreadyLoad = {
		balanco : false,
		producao : false,
		produtividade : false
	}

function loadHome(){
	toogleVisib('home');
}

eh_admin = false;

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
		if(eh_admin){
			loadDropDownProducaoAgricultores();
			loadDropDownProducaoAgricultoresJitterAdmin();
		} else {
			loadDropDownProducaoAgricultoresJitterGeral();
		}
		

		alreadyLoad.producao = true;
	}
	toogleVisib('producao');
}

function loadProdutividade(){
	if (!alreadyLoad.produtividade){
		$("#main").scrollTop(0);
		if(eh_admin){
			loadDropDownProdutividadeTecnicas();
			loadDropDownProdutividadeAgricultores();
		} else {
			loadDropDownProdutividadeAgricultoresGeral();
		}
		alreadyLoad.produtividade = true;
	}
	toogleVisib('produtividade');
}

function loadAnalises(){
	toogleVisib('analises');
}