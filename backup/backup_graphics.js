//Antigo método de graph2
/*function graph2Antigo() {
    var margin = {
        top : 20,
        right : 20,
        bottom : 60,
        left : 50
    }, width = 1100 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal().rangeRoundBands([0, width - 120], .1);

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear().range([height, 0]);

    //var color = d3.scale.ordinal().range(["#3498db",
    //  "#2ecc71", "#9b59b6", "#f1c40f", "#e67e22", "#e74c3c", "#7f8c8d", "#9A12B3", "#f0145a", "#ad3d3d", "#0f5578"]);
    var color = d3.scale.category20();

    var xAxis = d3.svg.axis().scale(x0).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

    var tip2 = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        return "<strong>" + d.cultura + ":</strong> <span style='color:orange'>" + d.valorProduzido + " kg</span>";
    });

    var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
        var texto = "";
        var textoRegiao = "";
        texto += "<strong>Produção de " + d.cultura.replace(/\./g, " ") + "<br><br>";
        for (var i = 0; i < d.listaCultura.length; i++)//percorre as listas de culturas das regioes (no caso sao 3)
            for (var j = 0; j < d.listaCultura[i].culturas.length; j++) {//para cada lista de cultura de uma regiao, percorre todas as culturas
                var textoValorProduzido = 0;
                if (d.listaCultura[i].culturas[j].cultura == d.cultura) {//se a cultura que ele visitou for igual ao objeto passado(do mouseover),
                    if (!isNaN(d.listaCultura[i].culturas[j].valorProduzido)) {//testa se o valor produzido eh numero
                        textoValorProduzido = d.listaCultura[i].culturas[j].valorProduzido;
                    }
                    if (d.listaCultura[i].culturas[j].regiao == d.regiao)//se a regiao for a do mouseover, da destaque na cor
                        textoRegiao = "<span style='color:lightblue'> " + d.listaCultura[i].culturas[j].regiao + ":</span>";
                    else
                        textoRegiao = "<span style='color:white'> " + d.listaCultura[i].culturas[j].regiao + ":</span>";
                    texto += textoRegiao + " <span style='color:orange'> " + textoValorProduzido + " kg</span><br />";
                }
            }
        return texto;
    });

    var svg = d3.select("#graph2").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    d3.json("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtividade_regiao", function(error, data) {
        var tiposDeCultura = d3.keys(data[0]).filter(function(key) {
            return key !== "Regiao";
        });
        data.forEach(function(d) {
            d.culturas = tiposDeCultura.map(function(cultura) {
                return {
                    cultura : cultura,
                    valorProduzido : +d[cultura],
                    regiao : d.Regiao,
                    listaCultura : data
                };
            });
             // tenho que passar pra tiposDeCultura a mesma ordem que d.culturas esta ordenando abaixo!
             // se o valor do comparado for maior, ele fica pra esquerda
            d.culturas.sort(function(a, b) {
                return b.valorProduzido - a.valorProduzido
            });
            for (var i = 0; i < tiposDeCultura.length; i++)
                tiposDeCultura[i] = d.culturas[i].cultura;
        });

        x0.domain(data.map(function(d) {
            return d.Regiao;
        }));
        x1.domain(tiposDeCultura).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) {
            return d3.max(d.culturas, function(d) {
                return d.valorProduzido;
            });
        })]);

        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

        svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate()").attr("x", 20).attr("y", -15).attr("dy", ".71em").style("text-anchor", "end").text("Produção");

        var regiao = svg.selectAll(".regiao").data(data).enter().append("g").attr("class", "g").attr("transform", function(d) {
            return "translate(" + x0(d.Regiao) + ",0)";
        });

        regiao.selectAll("rect").data(function(d) {
            return d.culturas;
        }).enter().append("rect").attr("width", x1.rangeBand()).attr("x", function(d) {
            return x1(d.cultura);
        }).attr("class", function(d) {
            return d.cultura.replace(/\./g, "");
        }).attr("y", function(d) {
            return y(d.valorProduzido);
        }).attr("height", function(d) {
            return height - y(d.valorProduzido);
        }).style("fill", function(d) {
            return color(d.cultura);
        }).on('mouseover', function(d) {
            //  var oi = $("#graph2 rect");
            $("#graph2 rect").css('opacity', 0.3);
            $("." + d.cultura.replace(/\./g, "") + "").css('opacity', 0.92);
            tip.show(d);
        }).on('mouseout', function(d) {
            $("#graph2 rect").css('opacity', 1);
            tip.hide(d);
        });

        var legend = svg.selectAll(".legend").data(tiposDeCultura.slice()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
            return "translate(0," + i * 15 + ")";
        });

        legend.append("rect").attr("x", width - 2).attr("width", 10).attr("height", 10).style("fill", color);

        legend.append("text").attr("x", width - 4).attr("y", 5).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
            return d;
        });

    });
} 
*/




function graph2() {

    var producao_regiao = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtividade_regiao2");

    var culturas = _.keys(producao_regiao)
    var layers = _.values(producao_regiao);
    var labels = _.pluck(_.values(producao_regiao)[0], 'regiao');

    generateBarGraph1(layers, labels, culturas);

    function generateBarGraph1(layers, labels, legendas) {

        //Remove qualquer gráfico que já exista na seção
        d3.select("#grafico_regiao").selectAll("svg").remove();

        //Tamanos e Quantidades
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
        }, width = 1100 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

        //Escalas
        var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width - 100], .08);
        var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);
        var color = d3.scale.category20b();

        //Eixos
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

        //Criação do gráfico
        var svg = d3.select("#grafico_regiao").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
            return d.cultura.replace(/\./g, "");
        }).on('mouseover', function(d) {
            $("#graph2 rect").css('opacity', 0.1);
            $("." + d.cultura.replace(/\./g, "") + "").css('opacity', 1);
            tip.show(d);
        }).on('mouseout', function(d) {
            $("#graph2 rect").css('opacity', 1);
            tip.hide(d);
        });

        //Adiciona eixos
        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
        svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(0)").attr("x", 20).attr("y", -15).attr("dy", ".71em").style("text-anchor", "end").text("Produção");

        //Tooltip
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {

            var texto = "";
            var textoRegiao = "";
            texto += "<strong>Produção de " + d.cultura + "<br><br>";
            for (var c in producao_regiao) {
                var textoProducao = 0;
                if (c == d.cultura) {
                    for (var i = 0; i < producao_regiao[c].length; i++) {
                        if (!isNaN(producao_regiao[c][i].producao))
                            textoProducao = producao_regiao[c][i].producao.toFixed(2);
                        if (producao_regiao[c][i].regiao == d.regiao)
                            textoRegiao = "<span style='color:yellow'> " + producao_regiao[c][i].regiao + ":</span>";
                        else
                            textoRegiao = "<span style='color:white'> " + producao_regiao[c][i].regiao + ":</span>";
                        texto += textoRegiao + " <span style='color:orange'> " + textoProducao + " kg</span><br />";
                    }
                }
            }
            return texto;

        });
        svg.call(tip);

        //Legenda
        var legend = svg.selectAll(".legend").data(legendas).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });
        legend.append("rect").attr("x", width - 2).attr("width", 10).attr("height", 10).style("fill", function(d, i) {
            return color(i);
        });

        legend.append("text").attr("x", width - 6).attr("y", 5).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
            return d;
        });
    }

    var valorAtualRegioes = $("#select_regioes").val();
    changeAgricultores(valorAtualRegioes);

}

function graph3() {

    var produ_agricultores = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtividade_dos_agricultores");
    var agricultores = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/agricultores");
    var regioes = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/regioes");
    var media_producao_regiao = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/media_producao_regiao");

    produ_agricultores = _.filter(produ_agricultores, function(produ) {
        return produ.producao > 0;
    });

    agricultores = _.filter(agricultores, function(agricultor) {
        return _.contains(_.pluck(produ_agricultores, 'id_agricultor'), agricultor.id);
    });

    //DropDown regiões
    var selectRegioes = d3.select("#droplist_regioes").append("select").attr("id", "select_regioes").on("change", function() {
        changeAgricultores(this.options[this.selectedIndex].value);
    }).selectAll("option").data(regioes).enter().append("option").attr("value", function(d) {
        return d.id;
    }).text(function(d) {
        return d.regiao;
    });

    //DropDown agricultores
    var selectAgricultores = d3.select("#droplist_agricultores").append("select").attr("id", "select_agricultores").on("change", function() {
        changeGraficoProduAgricultor(this.options[this.selectedIndex].value, $("#select_regioes").val());
    }).selectAll("option").data(agricultores).enter().append("option").attr("value", function(d) {
        return d.id;
    }).text(function(d) {
        return d.nome_agricultor;
    });

    function changeAgricultores(regiaoSelecionadaId) {
        //Remove agricultores do dropdown
        d3.select("#select_agricultores").selectAll("option").remove();

        //Seleciona agricultores
        var agricultoresDaRegiao = _.filter(agricultores, function(agricultor) {
            return regiaoSelecionadaId == agricultor.id_regiao;
        });

        //Popula DropDown
        d3.select("#select_agricultores").selectAll("option").data(agricultoresDaRegiao).enter().append("option").attr("value", function(d) {
            return d.id;
        }).text(function(d) {
            return d.nome_agricultor;
        });

        //Valor Default
        var valorAtualAgricultores = $("#select_agricultores").val();
        changeGraficoProduAgricultor(valorAtualAgricultores, regiaoSelecionadaId);

    }

    function changeGraficoProduAgricultor(agricultorId, regiaoSelecionadaId) {
        //Produção do Agricultor
        var selecionados = _.filter(produ_agricultores, function(object) {
            return object.id_agricultor == agricultorId;
        });
        var producaoAgricultor = selecionados;
        producaoAgricultor = _.sortBy(producaoAgricultor, "id_cultura");

        //Média região atual
        var media_regiao_atual = _.filter(media_producao_regiao, function(object) {
            return object.id_regiao == regiaoSelecionadaId;
        });
        //Média da produção da região das culturas que o agricultor plantou
        var media_agricultor = _.filter(media_regiao_atual, function(object) {
            return _.contains(_.pluck(selecionados, 'id_cultura'), object.id_cultura);
        });
        media_agricultor = _.sortBy(media_agricultor, "id_cultura");

        //Cria dataframe
        var quant_culturas = media_agricultor.length;
        var layers = [producaoAgricultor, media_agricultor];
        var labels = _.pluck(selecionados, 'nome_cultura');

        generateBarGraph(layers, labels);

    }

    function generateBarGraph(layers, labels) {

        //Remove qualquer gráfico que já exista na seção
        d3.select("#grafico_agricultor").selectAll("svg").remove();

        //Tamanos e Quantidades
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
        }, width = 1100 - margin.left - margin.right, height = 500 - margin.top - margin.bottom;

        //Escalas
        var x = d3.scale.ordinal().domain(labels).rangeRoundBands([15, width - 100], .08);
        var y = d3.scale.linear().domain([0, yGroupMax]).range([height, 0]);
        var color = d3.scale.ordinal().range(["#9b59b6", "#3498db"]);

        //Eixos
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

        //Criação do gráfico
        var svg = d3.select("#grafico_agricultor").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

        //Adiciona eixos
        svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
        svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(0)").attr("x", 20).attr("y", -15).attr("dy", ".71em").style("text-anchor", "end").text("Produção");

        //Tooltip
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
            return "<strong>" + d.nome_cultura + ":</strong> <span style='color:orange'>" + d.producao.toFixed(2) + " kg</span>";
        });
        svg.call(tip);

        //Legenda
        var descricaoLegenda = ["Produção do agricultor", "Média regional"];
        var legend = svg.selectAll(".legend").data(descricaoLegenda.slice()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
            return "translate(0," + i * 20 + ")";
        });
        legend.append("rect").attr("x", width - 2).attr("width", 10).attr("height", 10).style("fill", color);
        legend.append("text").attr("x", width - 6).attr("y", 5).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
            return d;
        });
    }

    var valorAtualRegioes = $("#select_regioes").val();
    changeAgricultores(valorAtualRegioes);

}

/*
 <script>
 var margin = {
 top : 35,
 right : 120,
 bottom : 20,
 left : 120
 }, width = 1000 - margin.left - margin.right, height = 1200 - margin.top - margin.bottom;

 var x = d3.scale.linear().range([0, width]);

 var barHeight = 60;

 var color = d3.scale.ordinal().range(["steelblue", "#ccc"]);

 var duration = 800, delay = 25;

 var partition = d3.layout.partition().value(function(d) {
 return d.size;
 });

 var xAxis = d3.svg.axis().scale(x).orient("top");

 var tip = d3.tip()
 .attr('class', 'd3-tip')
 .offset([-10, 0])
 .html(function(d) {
 var texto = "";
 for (var i = 0; i < d.parent.parent.children.length; i++)
 for (var j = 0; j < d.parent.parent.children[i].children.length; j++) {
 if (d.parent.parent.children[i].children[j].name == d.name)
 texto +=   d.parent.parent.children[i].name +  ": <span style='color:orange'> " + d.parent.parent.children[i].children[j].value + " kg</span><br />";
 }
 return "<strong>Produção de " + d.name + "</strong> <br>" + texto;
 });

 var svg = d3.select("#graphsvg").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 svg.call(tip);

 svg.append("rect").attr("class", "background").attr("width", width).attr("height", height).on("click", up);

 svg.append("g").attr("class", "x axis");

 svg.append("g").attr("class", "y axis").append("line").attr("y1", "100%");

 d3.json("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtividade_regiao", function(error, root) {
 partition.nodes(root);
 x.domain([0, root.value]).nice();
 down(root, 0);
 });

 function down(d, i) {
 if (!d.children || this.__transition__)
 return;
 var end = duration + d.children.length * delay;

 // Mark any currently-displayed bars as exiting.
 var exit = svg.selectAll(".enter").attr("class", "exit");

 // Entering nodes immediately obscure the clicked-on bar, so hide it.
 exit.selectAll("rect").filter(function(p) {
 return p === d;
 }).style("fill-opacity", 1e-6);

 // Enter the new bars for the clicked-on data.
 // Per above, entering bars are immediately visible.
 var enter = bar(d).attr("transform", stack(i)).style("opacity", 1);

 // Have the text fade-in, even though the bars are visible.
 // Color the bars as parents; they will fade to children if appropriate.
 enter.select("text").style("fill-opacity", 1e-6);
 enter.select("rect").style("fill", color(true));

 // Update the x-scale domain.
 x.domain([0, d3.max(d.children, function(d) {
 return d.value;
 })]).nice();

 // Update the x-axis.
 svg.selectAll(".x.axis").transition().duration(duration).call(xAxis);

 // Transition entering bars to their new position.
 var enterTransition = enter.transition().duration(duration).delay(function(d, i) {
 return i * delay;
 }).attr("transform", function(d, i) {
 return "translate(0," + barHeight * i * 1.2 + ")";
 });

 // Transition entering text.
 enterTransition.select("text").style("fill-opacity", 1);

 // Transition entering rects to the new x-scale.
 enterTransition.select("rect").attr("width", function(d) {
 return x(d.value);
 }).style("fill", function(d) {
 return color(!!d.children);
 });

 // Transition exiting bars to fade out.
 var exitTransition = exit.transition().duration(duration).style("opacity", 1e-6).remove();

 // Transition exiting bars to the new x-scale.
 exitTransition.selectAll("rect").attr("width", function(d) {
 return x(d.value);
 });

 // Rebind the current node to the background.
 svg.select(".background").datum(d).transition().duration(end);

 d.index = i;
 }

 function up(d) {
 if (!d.parent || this.__transition__)
 return;
 var end = duration + d.children.length * delay;

 // Mark any currently-displayed bars as exiting.
 var exit = svg.selectAll(".enter").attr("class", "exit");

 // Enter the new bars for the clicked-on data's parent.
 var enter = bar(d.parent).attr("transform", function(d, i) {
 return "translate(0," + barHeight * i * 1.2 + ")";
 }).style("opacity", 1e-6);

 // Color the bars as appropriate.
 // Exiting nodes will obscure the parent bar, so hide it.
 enter.select("rect").style("fill", function(d) {
 return color(!!d.children);
 }).filter(function(p) {
 return p === d;
 }).style("fill-opacity", 1e-6);

 // Update the x-scale domain.
 x.domain([0, d3.max(d.parent.children, function(d) {
 return d.value;
 })]).nice();

 // Update the x-axis.
 svg.selectAll(".x.axis").transition().duration(duration).call(xAxis);

 // Transition entering bars to fade in over the full duration.
 var enterTransition = enter.transition().duration(end).style("opacity", 1);

 // Transition entering rects to the new x-scale.
 // When the entering parent rect is done, make it visible!
 enterTransition.select("rect").attr("width", function(d) {
 return x(d.value);
 }).each("end", function(p) {
 if (p === d)
 d3.select(this).style("fill-opacity", null);
 });

 // Transition exiting bars to the parent's position.
 var exitTransition = exit.selectAll("g").transition().duration(duration).delay(function(d, i) {
 return i * delay;
 }).attr("transform", stack(d.index));

 // Transition exiting text to fade out.
 exitTransition.select("text").style("fill-opacity", 1e-6);

 // Transition exiting rects to the new scale and fade to parent color.
 exitTransition.select("rect").attr("width", function(d) {
 return x(d.value);
 }).style("fill", color(true));

 // Remove exiting nodes when the last child has finished transitioning.
 exit.transition().duration(end).remove();

 // Rebind the current parent to the background.
 svg.select(".background").datum(d.parent).transition().duration(end);
 }

 // Creates a set of bars for the given data node, at the specified index.
 function bar(d) {
 var bar = svg.insert("g", ".y.axis").attr("class", "enter").attr("transform", "translate(0,5)").selectAll("g").data(d.children).enter().append("g").style("cursor", function(d) {
 return !d.children ? null : "pointer";
 }).on("click", down);

 bar.append("text").attr("x", -6).attr("y", barHeight / 2).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
 return d.name;
 });

 bar.append("rect").attr("width", function(d) {
 return x(d.value);
 }).attr("height", barHeight).on('mouseover', tip.show)
 .on('mouseout', tip.hide);

 return bar;
 }

 // A stateful closure for stacking bars horizontally.
 function stack(i) {
 var x0 = 0;
 return function(d) {
 var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
 x0 += x(d.value);
 return tx;
 };
 }
 */
