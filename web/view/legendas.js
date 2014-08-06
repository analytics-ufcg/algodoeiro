function colocaLegenda(svg, dados, color, posXRect, posYRect){
	var legend = svg.selectAll(".legend").data(dados).enter().append("g").attr("class", "legend").attr("transform", function(d, i) {
		return "translate(0," + i * 20 + ")";
	});

	legend.append("rect").attr("x", posXRect).attr("y", posYRect).attr("width", 10).attr("height", 10).style("fill", color);

	legend.append("text").attr("x", posXRect - 5).attr("y", posYRect + 5).attr("dy", ".35em").style("text-anchor", "end").text(function(d) {
		return d;
	});
}