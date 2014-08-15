var menuAtivo = null;

$( document ).ready( function() {
	$("#nav-phone").html($("#nav-desktop").html());
	$("#nav-phone").on("click", "li", function () {
		if (menuAtivo !== null) {
			menuAtivo.removeClass("active");
		}

		menuAtivo = $(this);
		menuAtivo.addClass("active");
	});
});