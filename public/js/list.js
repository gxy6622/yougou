//点击弹出list
$('.footer li.first').click(function() {
	$('.footer li.first>ul.list').toggle();
});
//点击弹出nav
$('.menu').click(function() {
	$('.nav').toggle();
});

$('.srch-order li').click(function() {
	$(this).addClass('active').siblings().removeClass('active');
});
//从当前浏览器url中解析出来的id
var params = window.location.search.substr(1).split('&');
var cid = parseInt(params[0].split('=')[1]);
function updateList(data) {
	data.forEach(function(item) {
		$(`
			<li>
				<a href="detail.html?id=${ item.id }">
					<div class="avatar-wrapper">
						<img src="${ item.avatar }" />
						<span class="mark-price">￥${ item.markPrice }</span>
					</div>
					<p class="name">${ item.name }</p>
					<span class="price">￥${ item.price }</span>
					<span class="old-price">￥${ item.oldPrice}</span>
				</a>
			</li>
		`).appendTo('.content>ul.content-main');
	});
}
//发送ajax请求指定分类商品数据
myHttp({
	type:'post',
	url:'/product/list',
	data:{ cid: cid },
	success:function(data) {
		updateList(data);
	}
});