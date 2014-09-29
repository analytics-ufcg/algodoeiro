/**
* Gráfico que mostra a produção total de cada cultura em cada região. 
*/
function graficoProducaoRegiao(div_selector, layers, labels, culturas) {
	//Remove qualquer gráfico que já exista na seção
	d3.select(div_selector).selectAll("svg").remove();

	//Tamanhos e Quantidades
	var n = layers.length, // number of layers
	m = layers[0].length, // number of samples per layer
	yGroupMax = d3.max(layers, function(layer) {
		return d3.max(layer, function(d) {
			return d.producao;
		});
	});

	//Margens
	var margin = {
		top : 60,
		right : 10,
		bottom : 50,
		left : 70
	};
	var width = 1100 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	//Escalas
	var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width - 100], .08);
	var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);

	//Colow Brewer set3 com duas primeiras cores modificadas.
	//var pallete = ["#053061", "#2166ac","#4393c3", "#fdb462", "#bebada", "#fb8072", "#fe9929", "#762a83", "#f4a582", "#7fbc41", "#bc80bd", "#5aae61", "#ffed6f"];
	//var color = d3.scale.ordinal().range(pallete);
	var color = d3.scale.category20b();

	//Eixos
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(""));

	//Criação do gráfico
	var svg = d3.select(div_selector).append("svg").attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Dados
	var layer = svg.selectAll(".layer").data(layers).enter().append("g").attr("class", "layer").style("fill", function(d, i) {
		return color(i);
	});

	//Barras
	var rect = layer.selectAll("rect").data(function(d) {
		return d;
	}).enter().append("rect").attr("x", function(d, i, j) {
		return x(d.regiao) + x.rangeBand() / n * j;
	}).attr("width", x.rangeBand() / n).attr("y", function(d) {
		return y(d.producao);
	}).attr("height", function(d) {
		return height - y(d.producao);
	}).attr("class", function(d) {
		return d.cultura.replace(" ", "");
	}).on('mouseover', function(d) {
		$(div_selector + " .layer rect").css('opacity', 0.25);
		$("." + d.cultura.replace(" ", "") + "").css('opacity', 1);
		tip.show(d);
	}).on('mouseout', function(d) {
		$(div_selector + " .layer rect").css('opacity', 1);
		tip.hide(d);
	});

	//Adiciona eixos

	// Eixo X
	svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(xAxis);

	// Eixo Y
	svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("class", "label")
	.attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Produção (kg)");

	//Tooltip
	var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
		var qtdeRegioes = labels.length;
		// onde labels eh o array com nomes de regioes
		var textoTooltip = "";
		var textoRegiao = "";
		var cor = "";
		textoTooltip += "<strong>" + d.cultura + "</strong><br><br>";
		for (var i = 0; i < qtdeRegioes; i++) {
			if (layers[culturas.indexOf(d.cultura)][i].regiao == d.regiao)
				cor = "orange";
			else
				cor = "white";
			textoRegiao += "<span style='color:" + cor + "'> " + layers[culturas.indexOf(d.cultura)][i].regiao + ": " 
			+ layers[culturas.indexOf(d.cultura)][i].producao.toFixed(2) + " kg</span><br>";
		}

		textoTooltip += textoRegiao + "<br/>";
		return textoTooltip;

	});
	svg.call(tip);

	var cor = function(d, i) {
		return color(i);
	};

	colocaLegenda(svg, culturas, cor, width - 2, 0);
}

/**
* Gráfico que mostra a produção de cada cultura de um agricultor, comparada com a média da produção em sua região. 
*/
function graficoProducaoPorAgricultor(div_selector, layers, labels) {
    //Remove qualquer gráfico que já exista na seção
	d3.select(div_selector).selectAll("svg").remove();

	//Tamanhos e Quantidades
	var n = layers.length, // number of layers
	m = layers[0].length, // number of samples per layer
	yGroupMax = d3.max(layers, function(layer) {
		return d3.max(layer, function(d) {
			return d.producao;
		});
	});

	//Margens
	var margin = {
		top : 60,
		right : 10,
		bottom : 50,
		left : 70
	};
	var width = 1100 - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	//Escalas
	var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width - 100], .08);
	var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);
	var color = d3.scale.ordinal().range(["#9b59b6", "#3498db"]);

	//Eixos
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

	//Criação do gráfico
	var svg = d3.select(div_selector).append("svg").attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom).append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Dados
	var layer = svg.selectAll(".layer").data(layers).enter().append("g").attr("class", "layer").style("fill", function(d, i) {
		return color(i);
	});

	//Barras
	var rect = layer.selectAll("rect").data(function(d) {
		return d;
	}).enter().append("rect").attr("x", function(d, i, j) {
		return x(d.nome_cultura) + x.rangeBand() / n * j;
	}).attr("width", x.rangeBand() / n).attr("y", function(d) {
		return y(d.producao);
	}).attr("height", function(d) {
		return height - y(d.producao);
	}).on('mouseover', function(d) {
		tip.show(d);
	}).on('mouseout', function(d) {
		tip.hide(d);
	});

	// Adiciona eixos
	svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(xAxis).attr("font-size", "17px");
	svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("class", "label")
	.attr("transform", "rotate(-90)").attr("x", -7).attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Produção (kg)");

	// Tooltip
	var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
		return "<strong>" + d.nome_cultura + ":</strong> <span style='color:orange'>" + d.producao.toFixed(2) + " kg</span>";
	});
	svg.call(tip);

	// Legenda

	var descricaoLegenda = ["Produção do agricultor", "Média regional"];

	colocaLegenda(svg, descricaoLegenda.slice(), color, width - 50, -45);
}



function graficoJitterProducaoAgricultores(div_selector, agricultor, data, regioes) {

    var dataAux = _.clone(data);
    labels = _.pluck(regioes, 'regiao');
    var yGroupMax = d3.max(_.pluck(dataAux, 'producao'));

    if (eh_admin){
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
            return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Produção:</strong> <span>" + d.producao + " kg </span> ";
        });     
    } else {
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
            return "<strong>Produção:</strong> <span> " + d.producao + " kg </span> ";
        });
    }

    var margin = {
        top : 20,
        right : 20,
        bottom : 30,
        left : 80
    }, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom, padding = 1, // separation between nodes
    radius = 4;

    var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width], 1);
    var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left");

    var svg = d3.select(div_selector).append("svg").attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    for(var i = 0; i < labels.length; i++){
        var agricultorDaRegiao = _.filter(data, function(d){ return d.nome_regiao == labels[i]; });
        var valoresDaProducaoDosAgricultores = _.pluck(agricultorDaRegiao, 'producao');
        var widthRect = tamanhoBoxPlot(width, labels.length);
        criaBoxPlot(valoresDaProducaoDosAgricultores, svg, y, x(labels[i]), widthRect);
    }

    svg.call(tip);
    var yVar = "Produção (kg)", xVar = "Regiões";

    // Set initial positions
    dataAux.forEach(function(d) {
        d.x = x(d.nome_regiao);
        d.y = y(d.producao);
        d.color = color(d.nome_regiao);
        d.radius = radius;
    });

    svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text(xVar);

    svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(yVar);

    var node = svg.selectAll(".dot").data(dataAux).enter().append("circle").attr("class", "dot").attr("r", function(d) {
        if (eh_admin && d.id_agricultor == agricultor.id_agricultor)
            return radius + 2;
        else
            return radius;
    }).attr("cx", function(d) {
        return x(d.nome_regiao);
    }).attr("cy", function(d) {
        return y(d.producao);
    }).style("fill", function(d) {
        if (eh_admin && d.id_agricultor == agricultor.id_agricultor)
            return "red";
        else
            return d.color;
    }).on('mouseover', tip.show).on('mouseout', tip.hide);

    colocaLegenda(svg, color.domain().sort(), color, width - 18, 0);

    // d3.select("#collisiondetection").on("change", function() {
    //   force.resume();
    // });

    criaJitter(node, dataAux, padding, radius, x, y, "nome_regiao", "producao", width, height, "Produção");
}