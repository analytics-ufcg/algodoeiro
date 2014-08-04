function graficoProdutividadeTecnicas(div_selector, agricultor, data, regioes) {

    var dataAux = _.clone(data);
   // labels = [agricultor.nome_regiao];

    var yGroupMax = d3.max(_.pluck(dataAux, 'produtividade'));
    var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Produtividade:</strong> <span> " + d.produtividade + " kg / ha </span> <br>  <strong>Região:</strong> <span> " + d.nome_regiao + "</span>";
    });

    var margin = {
        top : 60,
        right : 10,
        bottom : 50,
        left : 70
    }, width = 960 - margin.left - margin.right, height = 500 - margin.top - margin.bottom, padding = 1, // separation between nodes
    radius = 4;

    var x = d3.scale.ordinal().domain([""]).rangeRoundBands([15, width], 1);
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

    var force = d3.layout.force().nodes(dataAux).size([width, height]).on("tick", tick).charge(-1.5).gravity(0).chargeDistance(30);

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

    colocaLegendaRegioes(color,svg, width); // graphics.js

    force.start();
    force.resume(); 

    function tick(e) {
        node.each(moveTowardDataPosition(e.alpha));

        node.each(collide(e.alpha, dataAux, padding, radius));
        node.attr("cx", function(d) {
            return d.x;
        });
    }

    function moveTowardDataPosition(alpha) {
        return function(d) {
            d.x += (posicaoX - d.x) * 0.05 * alpha;
            d.y += (y(d.produtividade) - d.y) * 0.1 * alpha;
        };
    }

}
