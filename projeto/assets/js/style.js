(function () {
	'use strict'

	$(document).ready(function(){
		$(document).scroll(function(){
			var onScroll = $('body').scrollTop()

			if (onScroll == 0) {
				$('nav').removeClass('nav-small')
				$('.btn-fixed').css('top', '100px')
			} else {
				$('nav').addClass('nav-small')
				$('.btn-fixed').css('top', '45px')
			}
		})
	})
})(); 