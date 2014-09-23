// utilizar Jquery para realizar esses procedimentos

	// remove dados que ja existam
	function dropAllInfos(divs) {
		d3.select(divs["comunidadeDiv"]).selectAll("g").remove();
		d3.select(divs["cidadeDiv"]).selectAll("g").remove();
		d3.select(divs["areaDiv"]).selectAll("g").remove();
		d3.select(divs["certificacaoDiv"]).selectAll("g").remove();
	}

	function changeInfoAgricultor(agricultorId, ano, divs) {
		// remove dados que ja existam
		dropAllInfos(divs);
/*		// A funcao filter retorna uma lista o [0] eh para pegar o elemento dentro dessa lista.
		var agricultorSelecionado = _.filter(agricultores, function(object) {
			return object.id == agricultorId;
		})[0];

		// Seleciona a producao/produtividade do dado agricultor para depois pegar sua area
		var producaoSelecionada = _.filter(produ_agricultores, function(object) {
			return object.id_agricultor == agricultorId;
		});*/

		var agricultorSelecionado = getInfoAgricultor(agricultorId, ano);

		// Verificao a existencia do agricultor selecionado
		if (agricultorSelecionado != undefined) {
			var comunidadeMsg = agricultorSelecionado[0].nome_comunidade;

			var cidadeMsg = agricultorSelecionado[0].nome_cidade;

			var areaValue = agricultorSelecionado[0].area;

			var certificacao = "";

			for (var i in agricultorSelecionado[0].certificacoes[ano]){
				if (i > 0){
					certificacao += ", "
				}
				certificacao += agricultorSelecionado[0].certificacoes[ano][i].certificacao;
			}

		} else {
			var comunidadeMsg = "Agricultor sem Produção";
			var cidadeMsg = "Agricultor sem Produção";
		}
		
		// Verifica se a area do agricultor foi informada
		if (areaValue != null) {
			areaMsg = areaValue + " ha";
		} else {
			areaMsg = "Não Informada";
		}

		// append nome comunidade
		d3.select(divs["comunidadeDiv"]).append("g").text(comunidadeMsg);

		// append nome cidade
		d3.select(divs["cidadeDiv"]).append("g").text(cidadeMsg);

		// append area produzida
		d3.select(divs["areaDiv"]).append("g").text(areaMsg);

		/*// append certificacoes
		var certificacoesMsg = "";
		// Percorre as certificacoes e concatena-as
		$(certificacoesLista).each(function(index){
			if(index > 0){
				certificacoesMsg = certificacoesMsg + ", "
			}
			certificacoesMsg = certificacoesMsg + ($(this)[0]["certificacao"]);
		});*/
		d3.select(divs["certificacaoDiv"]).append("g").text(certificacao);

	}


