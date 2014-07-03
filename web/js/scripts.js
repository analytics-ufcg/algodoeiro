function toogleVisib(id) {
	var listaelementos = document.getElementsByClassName("listalinks");

	for (var i = 0; i < listaelementos.lenght; i++) {
		listaelementos[i].style.display = 'none';
	}

	var toShow = document.getElementById(id);
	if (toShow.style.display == 'none') {
		toShow.style.display == 'block';
		console.log("mudou o estilo do elemento");
	} else {
		console.log("ja ta sendo mostrado");
	}
}