function getAnosProduzidos(idAgricultorSelecionado) {
	var producao2010 = getProduAgricultores(2010);
	var producao2011 = getProduAgricultores(2011);

	var anos = [];

	var isProducao2010 = _.contains(_.pluck(producao2010, "id_agricultor"), idAgricultorSelecionado);

	var isProducao2011 = _.contains(_.pluck(producao2011, "id_agricultor"), idAgricultorSelecionado);

	if(isProducao2010) {
		anos.push({id:2010, ano:"2010"}); 
	}

	if(isProducao2011) {
		anos.push({id:2011, ano:"2011"});
	}

	return anos;
}