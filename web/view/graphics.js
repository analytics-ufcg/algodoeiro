function graph2() {

    var producao_regiao = readJSON("http://analytics.lsd.ufcg.edu.br/algodoeiro_rest/produtividade_regiao2");

    var culturas = _.keys(producao_regiao);
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