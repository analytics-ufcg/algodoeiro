function graph1() {

	var receita = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/receita/2011");
	var lucro = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/lucro/2011");
	var custos = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/custo/total");
	var regioes = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes");

	var opcoesBalanco = ["receita", "lucro"];
	// Popula DropDown
	var selectRegioes = d3.select("#droplist_tipo_balanco").append("select").attr("id", "select_tipo_balanco").on("change", function() {
		var valorAtual = this.options[this.selectedIndex].value;
		if (valorAtual == "receita") {
			d3.select("#custo_regiao").selectAll("svg").remove();

			graficoBalanco("#custo_regiao", custos, receita, regioes);
		} else {
			d3.select("#custo_regiao").selectAll("svg").remove();

			graficoLucro("#custo_regiao", lucro, regioes);

		}
	}).selectAll("option").data(opcoesBalanco).enter().append("option").attr("value", function(d) {
		return d;
	}).text(function(d) {
		return d;
	});

	//Remove qualquer gráfico que já exista na seção
	d3.select("#custo_regiao").selectAll("svg").remove();
	graficoBalanco("#custo_regiao", custos, receita, regioes);

}

function graph2() {

	var producao_regiao = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regiao/producao/2011");

	var culturas = _.keys(producao_regiao);
	var layers = _.values(producao_regiao);
	var labels = _.pluck(_.values(producao_regiao)[0], 'regiao');

	ordenaCulturasPorProducao();

	function ordenaCulturasPorProducao() {
		var layerApodi = [];
		var layerCariri = [];
		var layerPajeu = [];
		var copiaCulturas = culturas.slice();

		for (var i in layers) {
			layerApodi[i] = layers[i][0];
		}

		layerApodi.sort(function(a, b) { //da sort em apodi pela produçao
			return b.producao - a.producao;
		});

		ordenaListaDeCulturas(culturas, layerApodi);

		agrupaAlgodao(culturas, layerApodi);

		//organiza as barras seguintes de acordo com as culturas ordenadas por apodi
		for (var i in layers) {
			layerCariri[i] = layers[copiaCulturas.indexOf(layerApodi[i].cultura)][1];
			layerPajeu[i] = layers[copiaCulturas.indexOf(layerApodi[i].cultura)][2];
		}
		//passa os valores pros layers finais
		for (var i in layers) {
			layers[i][0] = layerApodi[i];
			layers[i][1] = layerCariri[i];
			layers[i][2] = layerPajeu[i];
		}
		ordenaListaDeCulturas(culturas, layerApodi);
	}

	//organiza o array com os nomes das culturas de acordo com apodi
	function ordenaListaDeCulturas(culturas, layerApodi) {
		for (var i = 0; i < culturas.length; i++) {
			culturas[i] = layerApodi[i].cultura;
		}
	}

	function agrupaAlgodao(culturas, layerApodi) {
		//culturas = culturas.sort();
		var qtdeCulturasAgrupar = 3;
		var pluma = "Pluma";
		var caroco = "Caroço";
		var algodao = "Algodão Aroeira";
		var iPluma = culturas.indexOf(pluma);
		var iAlgodao = culturas.indexOf(algodao);
		var iCaroco = culturas.indexOf(caroco);

    	layerApodi.unshift(layerApodi[iAlgodao], layerApodi[culturas.indexOf(caroco)], layerApodi[culturas.indexOf(pluma)]);
    	layerApodi.splice(iPluma + qtdeCulturasAgrupar, 1);
		layerApodi.splice(iCaroco + qtdeCulturasAgrupar, 1);
		layerApodi.splice(iAlgodao + qtdeCulturasAgrupar, 1);
	}

	graficoProducaoRegiao("#grafico_regiao", layers, labels, culturas);

}

function plotaGraficoProducaoAgricultor(idAgricultor, idRegiao, ano) {
	var produ_agricultores = getProduAgricultores(ano);
	var agricultores = getAgricultores(idRegiao);
	var regioes = getRegioes();
	var media_producao_regiao = getMediaProducaoRegiao(ano);
    
	// ---------------------- MAIN -----------------------
	    changeInfoAgricultor(idAgricultor, idRegiao); 
	    changeGraficoProduAgricultor(idAgricultor, idRegiao);
	// ---------------------------------------------------
    
	// utilizar Jquery para realizar esses procedimentos
	function dropAllInfos() {
		d3.select("#info_comunidade").selectAll("g").remove();
		d3.select("#info_cidade").selectAll("g").remove();
		d3.select("#info_area_produzida").selectAll("g").remove();
	}

	function changeInfoAgricultor(agricultorId, regiaoSelecionadaId) {
		// remove dados que ja existam
		dropAllInfos();
		var agricultorSelecionado = _.filter(agricultores, function(object) {
			return object.id == agricultorId;
		})[0];

		console.log(_.filter(agricultores, function(object) {
			return object.id == agricultorId;
		}));

		var producaoSelecionada = _.filter(produ_agricultores, function(object) {
			return object.id_agricultor == agricultorId;
		});
		if (agricultorSelecionado != undefined) {
			var comunidadeMsg = agricultorSelecionado.nome_comunidade;

			var cidadeMsg = agricultorSelecionado.nome_cidade;

			var areaValue = producaoSelecionada[0].area;	
		} else {
			var comunidadeMsg = "Agricultor sem Produção";
			var cidadeMsg = "Agricultor sem Produção";
		}
		
		// Testa para valores null
		if (areaValue !== null) {
			areaMsg = areaValue + " ha";
		} else {
			areaMsg = "Não Informada";
		}

		// append nome comunidade
		d3.select("#info_comunidade").append("g").text(comunidadeMsg);

		// append nome cidade
		d3.select('#info_cidade').append("g").text(cidadeMsg);

		// append area produzida
		d3.select('#info_area_produzida').append("g").text(areaMsg);

	}

	function agrupaAlgodao(labels) {
		culturas = labels.slice();
		var qtdeCulturasAgrupar = 3;
		var pluma = "Pluma";
		var algodao = "Algodão Aroeira";
		var caroco = "Caroço";
		var iPluma = culturas.indexOf(pluma);
		var iCaroco = culturas.indexOf(caroco);
		var iAlgodao = 0;
		culturas.indexOf(algodao);
		//verificar se o agricultor plantou algodao, caso nao ache o index, retorna -1
		if (culturas.indexOf(algodao) >= 0) {
			labels.unshift(labels[labels.indexOf(algodao)],labels[labels.indexOf(caroco)], labels[labels.indexOf(pluma)]);
			labels.splice(iPluma + qtdeCulturasAgrupar, 1);
			labels.splice(iCaroco + qtdeCulturasAgrupar, 1);
			labels.splice(iAlgodao + qtdeCulturasAgrupar, 1);
		}
	}

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

		// Cria dataframe
		var quant_culturas = media_agricultor.length;
		var layers = [producaoAgricultor, media_agricultor];
		var labels = _.pluck(selecionados, 'nome_cultura');

		agrupaAlgodao(labels);

		graficoProducaoPorAgricultor("#grafico_agricultor", layers, labels);
	}

}


function graph4(idAgricultor, idRegiao, idAno) {
	
    var regioes = getRegioes();

    //var agricultores = getProdutores();

    var agricultores = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtores");
   // var produ_agricultores = getProduAgricultores();
    //if (idAno == 2010)
    var produtividade = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/produtividade/" + idAno);
    //else
    // var produtividade = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultor/produtividade/2011");

    //var produtividade = getProdutividade(idAno); //<- por algum motivo fica lento e o efeito jitter da erro...

    //cria array com resultado da busca pelo nome do agricultor
    var selecionado = $.grep(agricultores, function(e) {
        return e.id == idAgricultor;
    });
    var agricultor = selecionado[0];
    //var result = $.grep(produtividade, function(e){ return e.nome_agricultor == nomeAgricultor; });
    //var agricultor = result[0];

    var produtividade_regiao = [];
    // Seleciona so os agricultores da mesma regiao
    produtividade.forEach(function(d) {
        if (d.nome_regiao == agricultor.nome_regiao)
            produtividade_regiao.push(d);
    });

    changeInfoAgricultor(idAgricultor, idRegiao);
    // utilizar Jquery para realizar esses procedimentos
    function dropAllInfos() {
        d3.select("#info_comunidade_produtividade").selectAll("g").remove();
        d3.select("#info_cidade_produtividade").selectAll("g").remove();
        d3.select("#info_area_produzida_produtividade").selectAll("g").remove();
    }


    function changeInfoAgricultor(agricultorId, regiaoSelecionadaId) {
        // remove dados que ja existam
        dropAllInfos();
        var agricultorSelecionado = _.filter(agricultores, function(object) {
            return object.id == agricultorId;
        })[0];

        _.filter(agricultores, function(object) {
            return object.id == agricultorId;
        });

        var producaoSelecionada = _.filter(produtividade, function(object) {
            return object.id_agricultor == agricultorId;
        });
        if (agricultorSelecionado != undefined) {
            var comunidadeMsg = agricultorSelecionado.nome_comunidade;

            var cidadeMsg = agricultorSelecionado.nome_cidade;

            var areaValue = producaoSelecionada[0].area;    
        } else {
            var comunidadeMsg = "Agricultor sem Produção";
            var cidadeMsg = "Agricultor sem Produção";
        }
        
        // Testa para valores null
        if (areaValue !== null) {
            areaMsg = areaValue + " ha";
        } else {
            areaMsg = "Não Informada";
        }

        // append nome comunidade
        d3.select("#info_comunidade_produtividade").append("g").text(comunidadeMsg);

        // append nome cidade
        d3.select('#info_cidade_produtividade').append("g").text(cidadeMsg);

        // append area produzida
        d3.select('#info_area_produzida_produtividade').append("g").text(areaMsg);

    }

	
	//Remove qualquer gráfico que já exista na seção
	d3.select("#produtividade").selectAll("svg").remove();
	changeInfoAgricultor(idAgricultor, idRegiao);
	graficoProdutividade("#produtividade", agricultor,  produtividade_regiao, regioes);
	   

}
