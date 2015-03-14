// Load this script when page loads
$(document).ready(function(){
	$('.menubutton').click(function () {
		$('a.current').removeClass('current')
		$('.active').removeClass('active','extend')
		$(this).parent().addClass('active','extend');
		$(this).addClass('current')
		if ($(this).text() == "About Exploring") {
			$("body").css("background-image", "url('feint_explorers.png')");
		} else if ($(this).text() == "Introduction") {
			$("body").css("background-image", "url('feint_logo_only.png')");
		} else if ($(this).text() == "About Learning") {
			$("body").css("background-image", "url('feint_learn.png')");
		} else if ($(this).text() == "About Creating") {
			$("body").css("background-image", "url('feint_baby.png')");
		} else if ($(this).text() == "Why Join?") {
			$("body").css("background-image", "url('feint_lurker.png')");
		}
	});
});