/**
 * Gráfico que mostra a produtividade de algodão de um agricultor comparada com a dos outros agricultores da mesma região.
 * A caixa ao redor dos pontos representa os três valores que dividem as produtividades em quatro partes iguais 
 * (primeiro quartil, mediana, terceiro quartil).
 */
/*function graficoProdutividadeRegiao(div_selector, agricultor, data) {

	var dataAux = _.clone(data);
    labels = [agricultor.nome_regiao];

    // Maior produtividade dos agricultores da região
    var yGroupMax = d3.max(_.pluck(dataAux, 'produtividade'));

    var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Produtividade:</strong> <span> " + d.produtividade + " kg / ha </span> ";
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

    var svg = d3.select(div_selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom).append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    for(var i = 0; i < labels.length; i++){
		var agricultoresDaRegiao = _.filter(data, function(d){ return d.nome_regiao == labels[i]; });
		var valoresDosLucrosDosAgricultores = _.pluck(agricultoresDaRegiao, 'produtividade');
		var widthRect = tamanhoBoxPlot(width, labels.length);
		criaBoxPlot(valoresDosLucrosDosAgricultores, svg, y, x(labels[i]), widthRect);
	}

    svg.call(tip);

    var xVar = "Produtividade (kg / ha)", yVar = "Região";

    // Set initial positions
    dataAux.forEach(function(d) {
        d.x = x(d.nome_regiao);
        d.y = y(d.produtividade);
        d.color = color(d.nome_regiao);
        d.radius = radius;
    });

    svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")")
    .call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6)
    .style("text-anchor", "end").text("Região");
    //svg.append("g").attr("class", "axis").call(xAxis);

    svg.append("g").attr("class", "axis").call(yAxis)
    .append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Produtividade ( kg / ha)");

    var node = svg.selectAll(".dot").data(dataAux).enter().append("circle").attr("class", "dot").attr("r", function(d) {
        if (d.nome_agricultor == agricultor.nome_agricultor)
            return radius + 2;
        else
            return radius;
    }).attr("cx", function(d) {
        return x(d.nome_regiao);
    }).attr("cy", function(d) {
        return y(d.produtividade);
    }).style("fill", function(d) {
        if (d.nome_agricultor == agricultor.nome_agricultor)
            return "red";
        else
            return d.color;
    }).on('mouseover', tip.show).on('mouseout', tip.hide);

    criaJitter(node, dataAux, padding, radius, x, y, "nome_regiao", "produtividade", width, height, "ProdutividadeRegiao");
}*/

function graficoProdutividadeRegiao(div_selector, agricultor, data, regioes) {

    var dataAux = _.clone(data);
    labels = _.pluck(regioes, 'regiao');
    var yGroupMax = d3.max(_.pluck(dataAux, 'produtividade'));

    if (eh_admin) {
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
            return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Produtividade:</strong> <span>" + d.produtividade + " kg / ha </span> ";
        });     
    } else {
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
            return "<strong>Produtividade:</strong> <span> " + d.produtividade + " kg / ha </span> ";
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
        var valoresDaProdutividadeDosAgricultores = _.pluck(agricultorDaRegiao, 'produtividade');
        var widthRect = tamanhoBoxPlot(width, labels.length);
        criaBoxPlot(valoresDaProdutividadeDosAgricultores, svg, y, x(labels[i]), widthRect);
    }

    svg.call(tip);
    var yVar = "Produtividade (kg / ha)", xVar = "Regiões";

    // Set initial positions
    dataAux.forEach(function(d) {
        d.x = x(d.nome_regiao);
        d.y = y(d.produtividade);
        d.color = color(d.nome_regiao);
        d.radius = radius;
    });

    svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text(xVar);

    svg.append("g").attr("class", "axis").call(yAxis).append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(yVar);

    var node = svg.selectAll(".dot").data(dataAux).enter().append("circle").attr("class", "dot").attr("r", function(d) {
        if (eh_admin && d.nome_agricultor == agricultor.nome_agricultor)
            return radius + 2;
        else
            return radius;
    }).attr("cx", function(d) {
        return x(d.nome_regiao);
    }).attr("cy", function(d) {
        return y(d.produtividade);
    }).style("fill", function(d) {
        if (eh_admin && d.nome_agricultor == agricultor.nome_agricultor)
            return "red";
        else
            return d.color;
    }).on('mouseover', tip.show).on('mouseout', tip.hide);




    colocaLegenda(svg, color.domain().sort(), color, width - 18, 0);

    // d3.select("#collisiondetection").on("change", function() {
    //   force.resume();
    // });

    criaJitter(node, dataAux, padding, radius, x, y, "nome_regiao", "produtividade", width, height, "Produtividade");
}

/**
* Gráfico que mostra a produtividade de algodão de um agricultor comparada com a dos outros agricultores que
* utilizam as mesmas técnicas de plantio. O agricutlor selecionado está representado pela bolinha vermelha. 
*/
function graficoProdutividadeTecnicas(div_selector, agricultor, data, regioes) {

    var dataAux = _.clone(data);
   // labels = [agricultor.nome_regiao];

    var yGroupMax = d3.max(_.pluck(dataAux, 'produtividade'));
    var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Produtividade:</strong> <span> " + d.produtividade + " kg / ha </span> <br>  <strong>Região:</strong> <span> " + d.nome_regiao + "</span>";
    });

    var margin = {
        top : 20,
        right : 20,
        bottom : 30,
        left : 80
    }, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom, padding = 1, // separation between nodes
    radius = 4;

    var x = d3.scale.ordinal().domain([" "]).rangeRoundBands([15, width], 1);
    var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);
    var posicaoX = (width + 15) / 2;

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left");

    var svg = d3.select(div_selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom).append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  
    svg.call(tip);

    var yVar = "Produtividade (kg / ha)", xVar = "Agricultores";

    // Set initial positions
    dataAux.forEach(function(d) {
        d.x = posicaoX;
        d.y = y(d.produtividade);
        d.color = color(d.nome_regiao);
        d.radius = radius;
    });

    svg.append("g").attr("class", "axis").call(yAxis)
    .append("text").attr("class", "label").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(yVar);

    svg.append("g").attr("class", "axis").attr("transform", "translate(0," + height + ")").call(xAxis).append("text").attr("class", "label").attr("x", width).attr("y", -6).style("text-anchor", "end").text(xVar);

    var node = svg.selectAll(".dot").data(dataAux).enter().append("circle").attr("class", "dot").attr("r", function(d) {
        if (d.id_agricultor == agricultor)
            return radius + 2;
        else
            return radius;
    }).attr("cx", function(d) {
        return posicaoX;
    }).attr("cy", function(d) {
        return y(d.produtividade);
    }).style("fill", function(d) {
        if (d.id_agricultor == agricultor)
            return "red";
        else
            return d.color;
    }).on('mouseover', tip.show).on('mouseout', tip.hide);

    colocaLegenda(svg, color.domain().sort(), color, width - 18, 0);

    criaJitter(node, dataAux, padding, radius, x, y, "", "produtividade", width, height, "ProdutividadeTecnicas");
}
