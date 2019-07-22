var orderId = window.location.search.substr(1);
myHttp({
	type: 'post',
	url: '/order/list',
	data: { orderId: orderId },
	success: function(data) {;
		var orderlist = data[0];
		orderlist.forEach(function(item) {
			$(`
				<li>
					<img src="${ item.avatar }" />
					<div>
						<p class="name">${ item.name }</p>
						<span class="price">￥${ item.price }</span>
						<span class="count"><em>×</em>${ item.count }</span>
					</div>
				</li>
			`).appendTo('.info-list');
			$(`<span class="total-price">${ item.account }</span>`).appendTo('.total-price-wrapper>em');
			// $('p.order-id').text(data[0][0].id);
		});
	}
});

//地址选择
$('a.address-choice').click(function() {
	window.location.href = '/address.html';
});