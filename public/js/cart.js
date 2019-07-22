//点击弹出nav
$('.menu').click(function() {
	$('.nav').toggle();
});
//更新总数量和价格
function updateTotalCountAndPrice() {
	var totalCount = 0, totalPrice = 0, count = 0, price = 0;
	$('span.checkbox.normal.checked').each(function(i,item) {
		count = parseInt($(item).closest('li').find('.count').text());
		price = parseInt($(item).closest('li').find('.price').text());
		totalCount += count;
		totalPrice += count * price;
	});
	$('span.total-count').text(totalCount === 0 ? '' : `(${ totalCount})`);
	$('span.total-price').text(totalPrice);
}
//加购商品
function increaseHandler(e) {
	if(parseInt($(e.target).prev().text()) === 5) {
		alert('商品数量已达上限...');
		return;
	}
	myHttp({
		type:'post',
		url:'/cart/increase',
		data:{ id: $(e.target).closest('li').attr('data-id')},
		success:function(data) {
			var $target = $(e.target).prev();
			$target.text(parseInt($target.text()) + 1);
			updateTotalCountAndPrice();
		}
	});
}
//减少商品
function decreaseHandler(e) {
	if(parseInt($(e.target).next().text()) === 1) {
		alert('商品数量已达下限...');
		return;
	}
	myHttp({
		type:'post',
		url:'/cart/decrease',
		data:{ id: $(e.target).closest('li').attr('data-id')},
		success:function(data) {
			var $target = $(e.target).next();
			$target.text(parseInt($target.text()) - 1);
			updateTotalCountAndPrice();
		}
	});
}
//初始化页面
function initPage() {
	//全选反选
	$('.footer span.all').click(function() {
		if($(this).hasClass('checked')) $(this).add('ul.cart-list span.normal').removeClass('checked');
		else $(this).add('ul.cart-list span.normal').addClass('checked');
		updateTotalCountAndPrice();
	});
	$('span.checkbox.normal').click(function() {
		$(this).toggleClass('checked');
		if($('span.checkbox.normal:not(.checked)').length > 0) {
			$('.footer span.all').removeClass('checked');
		} else {
			$('.footer span.all').addClass('checked');
		}
		updateTotalCountAndPrice();
	});
	//加减数量
	$('ul.cart-list').click(function(e) {
		if($(e.target).hasClass('increase')) increaseHandler(e);
		if($(e.target).hasClass('decrease')) decreaseHandler(e);
	});
	//删除商品
	$('.remove').click(function() {
		var $checked = $('span.checkbox.normal.checked');
		if($checked.length < 1) { alert('请先选择..'); return; }
		if(!confirm('真删？')) return;
		var ids = [];
		$checked.each(function(i,item) {
			ids.push(parseInt($(item).closest('li').attr('data-id')));
		});
		myHttp({
			type:'post',
			url:'/cart/remove',
			data:{ ids: JSON.stringify(ids) },
			success:function() {
				$checked.each(function(i,item) {
					$(item).closest('li').remove();
				});
				$('.footer>.all-wrapper>span.all').removeClass('checked');
				updateTotalCountAndPrice();
			}
		});
	});
	//结算商品
	$('.btn-settlement').click(function() {
		var $checked = $('span.checkbox.normal.checked');
		if($checked.length < 1) { alert('请先选择..'); return; }
		var ids = [];
		$checked.each(function(i,item) {
			ids.push(parseInt($(item).closest('li').attr('data-id')));
		});
		myHttp({
			type:'post',
			url:'/cart/settlement',
			data:{
				ids:JSON.stringify(ids),
				account:$('span.total-price').text()
			},
			success:function(data) {
				$checked.each(function(i,item) {
					$(item).closest('li').remove();
				});
				$('.footer>.all-wrapper>span.all').removeClass('checked');
				updateTotalCountAndPrice();
				alert('结算生成订单成功，2s后自动跳转到付款页面');
				setTimeout(function() {
					window.location.href = `order.html?${data}`;
				},2000);
			}
		});
	});
}
//展示商品列表数据
myHttp({
	type:'post',
	url:'/cart/list',
	success:function(data) {
		data.forEach(function(item) {
			$(`
				<li data-id="${ item.id }">
					<span class="checkbox normal checked"></span>
					<a href="detail.html?id=${ item.pid }" class="avatar-wrapper">
						<img src="${ item.avatar }" />
					</a>
					<div class="info">
						<a href="detail.html?id=${ item.pid }" class="name">${ item.name }</a><br/>
						<a href="detail.html?id=${ item.pid }" class="price-wrapper">
							￥<span class="price">${ item.price }</span>
						</a>
						<div class="count-wrapper">
							<span class="decrease"></span>
							<span class="count">${ item.count }</span>
							<span class="increase"></span>
						</div>
					</div>
				</li>
			`).appendTo('ul.cart-list');
		});
		initPage();
		updateTotalCountAndPrice();
	}
});