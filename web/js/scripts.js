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

/*
function toogleVisibility(id) {
	var thelist = document.getElementsByClassName("listalinks");
    	for (var i = 0; i < thelist.length; i++) {
    		thelist[i].style.display = 'none';
    	}
    	var e = document.getElementById(id);
    	if(e.style.display == 'block') {
    		e.style.display = 'none';
    	} else {
    		e.style.display = 'block';
    	}
}

function toggle_visibility(id) {
    var e = document.getElementById(id);
    if (e.style.display == 'block') e.style.display = 'none';
    else e.style.display = 'block';

    hideAllBut(id);
}

function hideAllBut(id) {
    var lists = document.querySelectorAll('.list');
    for (var i = lists.length; i--; ) {
        if (lists[i].id != id) {
            lists[i].style.display = 'none';
        }
    }
}
*/