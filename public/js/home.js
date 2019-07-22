var mySwiper = new Swiper('.swiper-container', {
	autoplay:true,
	loop:true,
	pagination:{
		el:'.swiper-pagination',
		bulletElement : 'li',
	},
})
$(window).scroll(function() {
	if($(this).scrollTop() !== 0) {
		// alert('123');
		$('.header').css('background','red');
	}
});
$('.for-you>ul.title>li').click(function() {
	$(this).addClass('active').siblings().removeClass('active');
});

$(window).scroll(function() {
	if ($(this).scrollTop() === 0) {
	  $("span.rocket").addClass('active');
	} else {
	  $("span.rocket").removeClass('active');
	}
});
$("span.rocket").click(function() {
	$("body,html").animate({ scrollTop: 0 }, 800);
});