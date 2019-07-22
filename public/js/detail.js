$('.menu').click(function() {
	$('.nav').toggleClass('active');
});
//tab切换
$('ul.main-tab>li').click(function() {
	$(this).add($('.tab>.sub-tab').eq($(this).index())).addClass('active')
		.siblings().removeClass('active');
});

//数据请求
var params = window.location.search.substr(1).split('=');
var id = params[1];
myHttp({
	type:'post',
	url:'/product/list2',
	data:{ id: id },
	success:function(data) {
		var path = data[0].bannerImgs;
		var name = data[0].name;
		var price = data[0].price;
		var oldPrice = data[0].oldPrice;
		var pathes = path.substr(0).split(',');
		pathes.forEach(function(item) {
			$(`<li class="swiper-slide"><img src="${ item }"></li>`).appendTo('ul.swiper-wrapper');
		});
		$(`<div class="swiper-pagination"></div>`).appendTo('.swiper-container');
		$('.content p.name').text(name);
		$('.content span.price').text(price);
		$('.content span.old-price').text(oldPrice);
		var mySwiper = new Swiper('.swiper-container',{
			autoplay:true,
			loop:true,
			pagination:{
				el:'.swiper-pagination',
			},
		})
	}
});
$('.footer span.add-cart').click(function() {
	var params = window.location.search.substr(1).split('=');
	var pid = params[1];
	var count = 1;
	myHttp({
		type:'post',
		url:'/detail/add',
		data:{
			pid: pid,
			count: count
		},
		success:function(data) {
			if(data !== null) alert(data);
			else {
				alert('成功加入购物车');
				window.location.href = 'cart.html';
			}
			
		}
	});
});