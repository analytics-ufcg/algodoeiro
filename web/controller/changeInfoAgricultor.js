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

		var producaoSelecionada = _.filter(produ_agricultores, function(object) {
			return object.id_agricultor == agricultorId;
		});

		var comunidadeMsg = agricultorSelecionado.nome_comunidade;

		var cidadeMsg = agricultorSelecionado.nome_cidade;

		// var certificacaoMsg = agricultorSelecionado.certificacoes[0];

		var areaValue = producaoSelecionada[0].area;
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

		//append certificacao
		//d3.select('#').append('g').text(certificacaoMsg)

	}