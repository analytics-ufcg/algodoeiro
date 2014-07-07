
function toogleVisib(id) {
	var listaelementos = $(".listalinks");
	
	listaelementos.hide();
	var toShow = $("#" + id);
	toShow.show();
}