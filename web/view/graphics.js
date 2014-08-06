


function colocaLegendaRegioes(color,svg, width){
	var legend = svg.selectAll(".legend").data(color.domain().sort()).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
		return "translate(0," + i * 20 + ")";
	});

	legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", color);

	legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
		return d;
	});

}
