var menuAtivo = null;

$( document ).ready( function() {
	$("#navbar-phone-options").html($("#navbar-desktop-options").html());

	$(".navbar-custom-ul").on("click", "li", function () {
		desativarMenuAtivo();
		esconderMenu();

		menuAtivo = $(this);
		menuAtivo.addClass("active");
	});

	$("#navbar-phone-home").click(function () {
		desativarMenuAtivo();
		esconderMenu();
	});

	function desativarMenuAtivo() {
		if (menuAtivo !== null) {
			menuAtivo.removeClass("active");
		}
	}

	function esconderMenu() {
		var bootstrapEnvironment = findBootstrapEnvironment();
		if (bootstrapEnvironment === 'xs') {
			$("#navbar-phone-toggle").click();
		}
	}

	function findBootstrapEnvironment() {
	    var envs = ['xs', 'sm', 'md', 'lg'];

	    $el = $('<div>');
	    $el.appendTo($('body'));

	    for (var i = envs.length - 1; i >= 0; i--) {
	        var env = envs[i];

	        $el.addClass('hidden-'+env);
	        if ($el.is(':hidden')) {
	            $el.remove();
	            return env
	        }
    };
}
});