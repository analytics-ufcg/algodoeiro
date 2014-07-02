/**
 * Interessnte colocar aqui o papel do grafico, so pra fins de documentacao
 * 
 */
function graficoBalanco(div_selector,data,regioes) {

  labels = _.pluck(regioes,'regiao');
  var yGroupMax = d3.max(_.pluck(data,'receita')); 


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Receita:</strong> <span> R$ " + d.receita + " / ha </span> ";
  });

var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 1, // separation between nodes
    radius = 4;

var x = d3.scale.ordinal().domain(labels)
    .range([0, width]);

var y = d3.scale.linear().domain([0, yGroupMax])
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(div_selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

  var xVar = "Receita (R$ / ha)",
      yVar = "Regiões";

  var x = d3.scale.ordinal().domain(labels).rangeRoundBands([100, width - 100], .08);
  var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);


  var force = d3.layout.force()
    .nodes(data)
    .size([width, height])
    .on("tick", tick)
    .charge(-1)
    .gravity(0)
    .chargeDistance(20);

  // Set initial positions
  data.forEach(function(d) {
    d.x = x(d.nome_regiao);
    d.y = y(d.receita);
    d.color = color(d.nome_regiao);
    d.radius = radius;
  });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Regiões");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Receita ( R$ / ha)");

  var node = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", radius)
      .attr("cx", function(d) { return x(d.nome_regiao); })
      .attr("cy", function(d) { return y(d.receita); })
      .style("fill", function(d) { return d.color; })
            .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

  // d3.select("#collisiondetection").on("change", function() {
  //   force.resume();
  // });

  force.start();
force.resume();
  function tick(e) {
    node.each(moveTowardDataPosition(e.alpha));

    //if (checkbox.node().checked) node.each(collide(e.alpha));
node.each(collide(e.alpha));
    node.attr("cx", function(d) { return d.x; });
       // .attr("cy", function(d) { return d.y; });
  }

  function moveTowardDataPosition(alpha) {
    return function(d) {
      d.x += (x(d.nome_regiao) - d.x) * 0.005 * alpha;
      d.y += (y(d.receita) - d.y) * 0.5 * alpha;
    };
  }

  // Resolve collisions between nodes.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(data);
    return function(d) {
      var r = d.radius + radius + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }

}




/**
 * Interessnte colocar aqui o papel do grafico, so pra fins de documentacao
 * 
 */
function graficoLucro(div_selector,data,regioes) {

  labels = _.pluck(regioes,'regiao');
  var yGroupMax = d3.max(_.pluck(data,'lucro')); 
  var yGroupMin = d3.max(_.pluck(data,'lucro')); 


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>Agricultor: " + d.nome_agricultor + "</span> <br> <strong>Receita:</strong> <span> R$ " + d.lucro + " / ha </span> ";
  });

var margin = {top: 20, right: 20, bottom: 30, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    padding = 1, // separation between nodes
    radius = 3;

var x = d3.scale.ordinal().domain(labels)
    .range([0, width]);

var y = d3.scale.linear().domain([0, yGroupMax])
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select(div_selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

  var xVar = "Lucro ( R$ / ha)",
      yVar = "Regiões";

  var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width - 100], .08);
  var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);


  var force = d3.layout.force()
    .nodes(data)
    .size([width, height])
    .on("tick", tick)
    .charge(-1)
    .gravity(0)
    .chargeDistance(20);

  // Set initial positions
  data.forEach(function(d) {
    d.x = x(d.nome_regiao);
    d.y = y(d.lucro);
    d.color = color(d.nome_regiao);
    d.radius = radius;
  });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Regiões");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Lucro ( R$ / ha)");

  var node = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", radius)
      .attr("cx", function(d) { return x(d.nome_regiao); })
      .attr("cy", function(d) { return y(d.lucro); })
      .style("fill", function(d) { return d.color; })
            .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

  // d3.select("#collisiondetection").on("change", function() {
  //   force.resume();
  // });

  force.start();
force.resume();
  function tick(e) {
    node.each(moveTowardDataPosition(e.alpha));

    //if (checkbox.node().checked) node.each(collide(e.alpha));
node.each(collide(e.alpha));
    node.attr("cx", function(d) { return d.x; });
       // .attr("cy", function(d) { return d.y; });
  }

  function moveTowardDataPosition(alpha) {
    return function(d) {
      d.x += (x(d.nome_regiao) - d.x) * 0.05 * alpha;
      d.y += (y(d.lucro) - d.y) * 0.1 * alpha;
    };
  }

  // Resolve collisions between nodes.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(data);
    return function(d) {
      var r = d.radius + radius + padding,
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== d)) {
          var x = d.x - quad.point.x,
              y = d.y - quad.point.y,
              l = Math.sqrt(x * x + y * y),
              r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }

}



function graficoProducaoRegiao(div_selector,layers, labels, culturas) {
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
        top : 40,
        right : 10,
        bottom : 60,
        left : 70
    };
    var width = 1100 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    //Escalas
    var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width - 100], .08);
    var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);

    //Colow Brewer set3 com duas primeiras cores modificadas.
    var pallete = ["#a6cee3","#80b1d3","#fdb462","#bebada","#fb8072","#8dd3c7","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];
    var color = d3.scale.ordinal().range(pallete);

    //Eixos
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(""));

    //Criação do gráfico
    var svg = d3.select(div_selector).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
        $("#graph2 rect").css('opacity', 0.1);
        $("." + d.cultura.replace(" ", "") + "").css('opacity', 1);
        tip.show(d);
    }).on('mouseout', function(d) {
        $("#graph2 rect").css('opacity', 1);
        tip.hide(d);
    });

    //Adiciona eixos

    // Eixo X
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

    // Eixo Y
    svg.append("g").attr("class", "y axis").call(yAxis).append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Produção (Kg)");

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
            textoRegiao += "<span style='color:" + cor + "'> " + layers[culturas.indexOf(d.cultura)][i].regiao + ": " + layers[culturas.indexOf(d.cultura)][i].producao.toFixed(2) + " kg</span><br>";
        }

        textoTooltip += textoRegiao + "<br/>";
        return textoTooltip;

    });
    svg.call(tip);

    //Legenda
    var legend = svg.selectAll(".legend").data(culturas).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
    });

    legend.append("rect").attr("x", width - 2).attr("width", 10).attr("height", 10).style("fill", function(d, i) {
        return color(i);
    });

    legend.append("text").attr("x", width - 6).attr("y", 5).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
        return d;
    });
}


function graficoProducaoPorAgricultor(div_selector,layers, labels) {
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
        top : 40,
        right : 10,
        bottom : 60,
        left : 50
    };
    var width = 1100 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    //Escalas
    var x = d3.scale.ordinal().domain(labels).rangeRoundBands([10, width - 200], .08);
    var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 10]);
    var color = d3.scale.ordinal().range(["#9b59b6", "#3498db"]);

    //Eixos
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

    //Criação do gráfico
    var svg = d3.select(div_selector).append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
    svg.append("g").attr("class", "y axis").call(yAxis).append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -7)
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end").text("Produção (Kg)");


    // Tooltip
    var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        return "<strong>" + d.nome_cultura + ":</strong> <span style='color:orange'>" + d.producao.toFixed(2) + " kg</span>";
    });
    svg.call(tip);

    // Legenda
    var descricaoLegenda = ["Produção do agricultor", "Média regional"];
    var legend = svg.selectAll(".legend").data(descricaoLegenda.slice()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
        return "translate(0," + (i * 20) + ")";
    });
    legend.append("rect").attr("x", width - 2).attr("y", 30).attr("width", 10).attr("height", 10).style("fill", color);
    legend.append("text").attr("x", width - 6).attr("y", 35).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
        return d;
    });
}