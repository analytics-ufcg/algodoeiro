function graficoAgricultorCulturas(div_selector, data) {

	var dataAux = _.clone(data);
	labels = _.pluck(dataAux, 'nome_cultura');
	var yGroupMax = d3.max(_.pluck(dataAux, 'produtividade'));

	var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
		return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Produtividade:</strong> <span> R$ " + d.produtividade + " / ha </span> ";
	});

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

	var svg = d3.select(div_selector).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	for(var i = 0; i < labels.length; i++){
		var agricultorDaRegiao = _.filter(data, function(d){ return d.nome_cultura == labels[i]; });
		var valoresDaProdutividadeDosAgricultores = _.pluck(agricultorDaRegiao, 'produtividade');
		var widthRect = 60;
		criaBoxPlot(valoresDaProdutividadeDosAgricultores, svg, x, y, x(labels[i]), widthRect);
	}

	svg.call(tip);
	var xVar = "Produtividade (Kg / ha)", yVar = "Culturas";

	var force = d3.layout.force().nodes(dataAux).size([width, height]).on("tick", tick).charge(-1).gravity(0).chargeDistance(20);

	// Set initial positions
	dataAux.forEach(function(d) {
		d.x = x(d.nome_cultura);
		d.y = y(d.produtividade);
		d.color = color(d.nome_cultura);
		d.radius = radius;
	});

	svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text("Culturas");

	svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Produtividade ( Kg / ha)");

	//criaLinhaDeCustos(custos);

	var node = svg.selectAll(".dot").data(dataAux).enter().append("circle").attr("class", "dot").attr("r", radius).attr("cx", function(d) {
		return x(d.nome_cultura);
	}).attr("cy", function(d) {
		return y(d.produtividade);
	}).style("fill", function(d) {
		return d.color;
	}).on('mouseover', tip.show).on('mouseout', tip.hide);

	//colocaLegendaRegioes(color,svg, width);

	// d3.select("#collisiondetection").on("change", function() {
	//   force.resume();
	// });

	force.start();
	force.resume();


	/*function criaLinhaDeCustos(custos) {
		var layers_custos = _.values(custos);
		//Tamanhos e Quantidades
		var n = layers_custos.length, // number of layers
		m = layers_custos[0].length, // number of samples per layer
		yGroupMax = d3.max(layers_custos, function(layer) {
			return d3.max(layer, function(d) {
				return d.total;
			});
		});
		var widthRect = 142;
		//Dados
		var layer = svg.selectAll(".layer").data(layers_custos).enter().append("g").attr("class", "layer");

		var linhaCustos = layer.selectAll("rect").data(function(d) {
			return d;
		}).enter().append("rect").attr("x", function(d, i, j) {
			return x(d.nome_cultura) - widthRect / 2;
			//+ x.rangeBand() / n * j;
		}).attr("width", widthRect).attr("y", function(d) {
			return y(d.total);
		}).attr("height", function(d) {
			return 2;
		}).attr("class", function(d) {
			return d.nome_cultura;
		});
	}*/

	function tick(e) {
		node.each(moveTowardDataPosition(e.alpha));

		//if (checkbox.node().checked) node.each(collide(e.alpha));
		node.each(collide(e.alpha, dataAux, padding, radius));
		node.attr("cx", function(d) {
			return d.x;
		})
		;
		// .attr("cy", function(d) { return d.y; });
	}

	function moveTowardDataPosition(alpha) {
		return function(d) {
			d.x += (x(d.nome_cultura) - d.x) * 0.05 * alpha ;
			d.y += (y(d.produtividade) - d.y) * 0.1 * alpha;
		};
	}

}