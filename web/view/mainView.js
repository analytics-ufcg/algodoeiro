function colocaOrdemCerta(layer){
	function rearranjaCulturasAlgodao(objeto,layer,layerNovo,position){
		if(!(typeof objeto === "undefined")) {
			layerNovo.splice(position,0,objeto);
			var indexObjeto = _.indexOf(layer,objeto);
			layer.splice(indexObjeto,1);

		}
	}
	var pluma = getIdPluma();
	var caroco = getIdCaroco();
	var algodao = getIdAlgodao();

	//Encontra onde estão os layers de Alpodi
	var algodaoObjeto = _.find(layer,function(item){return item.id_cultura == algodao;});
	var plumaObjeto = _.find(layer,function(item){return item.id_cultura == pluma;});
	var carocoObjeto = _.find(layer,function(item){return item.id_cultura == caroco;});

	var layerNovo = [];
	rearranjaCulturasAlgodao(algodaoObjeto,layer,layerNovo,0);
	rearranjaCulturasAlgodao(carocoObjeto,layer,layerNovo,1);
	rearranjaCulturasAlgodao(plumaObjeto,layer,layerNovo,2);

	layerNovo = _.union(layerNovo,layer);
	return layerNovo;

}

function graficoProducaoRegiaoAbsoluto(ano) {

	var producao_regiao = getProducaoRegiao(ano);
	$("#grafico_regiao").html("");

	if(_.size(producao_regiao)>0){
		//Nome das culturas
		var culturas = _.keys(producao_regiao);
		//Matriz m x n, m culturas x n regioes
		var layers = _.values(producao_regiao);
		//Nome das regiões
		var labels = _.pluck(_.values(producao_regiao)[0], 'regiao');

		var novoLayers = ordenaCulturasPorProducao();

		var culturasNovaOrdem = [];

		for(i = 0; i < novoLayers.length; i++){
			culturasNovaOrdem.push(novoLayers[i][0].cultura);
		}
		graficoProducaoRegiao("#grafico_regiao", novoLayers, labels, culturasNovaOrdem);
	} else{
		$("#grafico_regiao").html("Sem Produção nesse ano.");
	}
	function ordenaCulturasPorProducao() {
		//NOVO
		var layersRegiao = []
		layersRegiao[0] = []

		//Nome das culturas
		var copiaCulturas = culturas.slice();

		//O valor da produção de todas as culturas da primeira região
		for (var i in layers) {
			layersRegiao[0][i] = layers[i][0];
		}

		layersRegiao[0].sort(function(a, b) { //da sort em apodi pela produçao
			return b.producao - a.producao;
		});

		ordenaListaDeCulturas(culturas, layersRegiao[0]);

		layersRegiao[0] = colocaOrdemCerta(layersRegiao[0]);

		if (layersRegiao[0][0] == undefined){
			alert("Erro, contate o administrador!");
		}

		//organiza as barras seguintes de acordo com as culturas ordenadas por apodi
		var novoLayer = [];
		var copyLayer = layers;
		for (j = 0; j < layersRegiao[0].length; j++){
			var culturaAtual = layersRegiao[0][j].cultura;
			//novoLayer.push(layers[copiaCulturas.indexOf(layersRegiao[0][j].cultura)]);
			var objectInLayers = _.find(layers, function(layer){ return layer[0].cultura == culturaAtual; })
			var indexInLayers = _.indexOf(layers,objectInLayers);
			layers.splice(indexInLayers,1);
			novoLayer.push(objectInLayers);

		}

		novoLayer = _.union(novoLayer,layers);

		return novoLayer;
		
		//ordenaListaDeCulturas(culturas, layersRegiao[0]);
	}


	//organiza o array com os nomes das culturas de acordo com apodi
	function ordenaListaDeCulturas(culturas, layerApodi) {
		for (var i = 0; i < culturas.length; i++) {
			culturas[i] = layerApodi[i].cultura;
		}
	}

}

function plotaGraficoProducaoAgricultor(idAgricultor, idRegiao, ano) {
	var produ_agricultores = getProduAgricultores(ano);
	var agricultores = getAgricultores(idRegiao);
	var regioes = getRegioes();
	var media_producao_regiao = getMediaProducaoRegiao(ano);
    

    var divs = {comunidadeDiv: "#info_comunidade_producao", cidadeDiv: "#info_cidade_producao", areaDiv:"#info_area_produzida_producao", certificacaoDiv: "#info_certificado_producao"}

	// ---------------------- MAIN -----------------------
	    changeInfoAgricultor(idAgricultor, ano, divs); // Funcao no arquivo changeInfoAgricultor.js
	    changeGraficoProduAgricultor(idAgricultor, idRegiao);
	// ---------------------------------------------------

	function changeGraficoProduAgricultor(agricultorId, regiaoSelecionadaId) {
		// Produção do Agricultor
		var selecionados = _.filter(produ_agricultores, function(object) {
			return object.id_agricultor == agricultorId;
		});

		var producaoAgricultor = selecionados;
		producaoAgricultor = _.sortBy(producaoAgricultor, "id_cultura");

		// Média região atual
		var media_regiao_atual = _.filter(media_producao_regiao, function(object) {
			return object.id_regiao == regiaoSelecionadaId;
		});

		// Média da produção da região das culturas que o agricultor plantou
		var media_agricultor = _.filter(media_regiao_atual, function(object) {
			return _.contains(_.pluck(selecionados, 'id_cultura'), object.id_cultura);
		});
		media_agricultor = _.sortBy(media_agricultor, "id_cultura");

		selecionados = colocaOrdemCerta(selecionados);

		// Cria dataframe
		var quant_culturas = media_agricultor.length;
		var layers = [producaoAgricultor, media_agricultor];
		var labels = _.pluck(selecionados, 'nome_cultura');


		graficoProducaoPorAgricultor("#grafico_agricultor", layers, labels);
	}

}


function plotGraficoProdutividadeRegiao(idAgricultor, idAno) {
	
    var regioes = getRegioes();

    //var agricultores = getProdutores();

    var agricultores = getProdutorAlgodao();

    var produtividade = getProdutividade(idAno);
   

    //cria array com resultado da busca pelo nome do agricultor
    if(eh_admin){
    	var selecionado = $.grep(produtividade, function(e) {
	        return e.id_agricultor == idAgricultor;
	    });
	    var agricultor = selecionado[0];

	    var divs = {comunidadeDiv: "#info_comunidade_produtividade", cidadeDiv: "#info_cidade_produtividade", areaDiv:"#info_area_produzida_produtividade", certificacaoDiv: "#info_certificado_produtividade"}
	    changeInfoAgricultor(idAgricultor, idAno, divs);  // Funcao no arquivo changeInfoAgricultor.js
		
	}
    //var result = $.grep(produtividade, function(e){ return e.nome_agricultor == nomeAgricultor; });
    //var agricultor = result[0];
/*
    var produtividade_regiao = [];
    // Seleciona so os agricultores da mesma regiao
    produtividade.forEach(function(d) {
        produtividade_regiao.push(d);
    });*/

	//Remove qualquer gráfico que já exista na seção
	d3.select("#produtividadeGraf").selectAll("svg").remove();
	$("#produtividadeGraf").html("");

	if (produtividade.length == 0){
        $("#produtividadeGraf").html("Sem Produção nesse ano.");
    } else {
		graficoProdutividadeRegiao("#produtividadeGraf", agricultor,  produtividade, regioes);
	}
}


function plotGraficoProducaoRegiao(idAgricultor, idAno) {
	
    var regioes = getRegioes();

    //var agricultores = getProdutores();

    var agricultores = getProdutorAlgodao();

	// var producao = getProduAgricultores(idAno);

	// producao = _.filter(producao, function(object) {
	// 		return object.id_cultura == 1;
	// 	});
   	
   	var producao = getProduAgricultoresAlgodao(idAno);
   	
    //cria array com resultado da busca pelo nome do agricultor
    if (eh_admin){
    	var selecionado = $.grep(producao, function(e) {
	        return e.id_agricultor == idAgricultor;
	    });
	    var agricultor = selecionado[0];

	    var divs = {comunidadeDiv: "#info_comunidade_producao_dos_agricultores", cidadeDiv: "#info_cidade_producao_dos_agricultores", areaDiv:"#info_area_produzida_producao_dos_agricultores", certificacaoDiv: "#info_certificado_producao_dos_agricultores"};
	    changeInfoAgricultor(idAgricultor, idAno, divs);  // Funcao no arquivo changeInfoAgricultor.js
	}
    //var result = $.grep(produtividade, function(e){ return e.nome_agricultor == nomeAgricultor; });
    //var agricultor = result[0];
/*
    var produtividade_regiao = [];
    // Seleciona so os agricultores da mesma regiao
    produtividade.forEach(function(d) {
        produtividade_regiao.push(d);
    });*/

	
	//Remove qualquer gráfico que já exista na seção
	d3.select("#grafico_producao_dos_agricultores").selectAll("svg").remove();
	$("#grafico_producao_dos_agricultores").html("");

	if (producao.length == 0){
        $("#grafico_producao_dos_agricultores").html("Sem Produção nesse ano.");
    } else {
		graficoJitterProducaoAgricultores("#grafico_producao_dos_agricultores", agricultor,  producao, regioes);
	}
}