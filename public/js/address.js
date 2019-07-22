$('.menu').click(function() {
	$('.nav').toggleClass('active');
});
// $('form button').click(function() {
// 	$('.update-address').removeClass('active');
// });
var addressForm = document.forms.address;

//地址展示
function getAddressList(data) {
	data.forEach(function(item) {
		$(`
			<li data-id=${ item.id }>
				<div class="address-list">
					<ul>
						<li class="first">
							<span class="name">${ item.receiveName }</span>
							<span class="phone">${ item.receiveTel }</span>
						</li>
						<li class="second">
							<span class="address">${ item.receiveAddress }</span>
						</li>
					</ul>
					<p class="clearfix">
						<span class="default"><img src="images/cart/icon_checkbox_uncheck.png" >设为默认地址</span>
						<span class="edit"><img src="images/address/edit.png" alt="">编辑</span></a>
						<span class="remove"><img src="images/address/delete.png" alt="">删除</span></a>
					</p>
				</div>
			</li>
		`).appendTo('.content>ul.address-wrapper');
	});	
		//删除地址
		$('span.remove').click(function() {
			if(!confirm('确定删除？')) return;
			var id = $(this).closest('li').attr('data-id');
			myHttp({
				type: 'post',
				url: '/address/remove',
				data: { id: JSON.stringify(id) },
				success: function() {
					var lis = $('ul.address-wrapper li');
					for(var i = 0; i < lis.length; i++) {
						if(lis.eq(i).attr('data-id') === id) {
							lis[i].remove();
							alert('删除成功..');
						}
					}
				}
			});
		});
		//进入地址编辑状态
		$('span.edit').click(function() {
			addressForm.mode.value = '0';
			var id = $(this).closest('li').attr('data-id');
			myHttp({
				type: 'post',
				url: '/address/edit',
				data: { id: id },
				success: function(result) {
					$('form.edit-form').attr('data-id', result[0].id);
					$('input.name-input').val(result[0].receiveName);
					$('input.phone-input').val(result[0].receiveTel);
					$('a.btn-info').text(result[0].receiveAddress);
					$('.update-address').toggleClass('active');
				}
			});
		});
}


//新增地址
$('.add-address').click(function() {
	addressForm.reset();
	$('.update-address').toggleClass('active');
	addressForm.mode.value = '1';
});	
$('.save-address').click(function() {
	if($('input.name-input').val() !== ''&&$('input.phone-input').val() !== ''&&$('a.btn-info').text() !== '省市区') {
		$('.update-address').toggleClass('active');
		var receiveName = $('input.name-input').val();
		var receiveTel = $('input.phone-input').val();
		var receiveAddress = $('a.btn-info').text();
		if(addressForm.mode.value !== '1') return;
		else {
			myHttp({
				type: 'post',
				url: '/address/add',
				data: {
					receiveName: receiveName,
					receiveTel: receiveTel,
					receiveAddress: receiveAddress
				},
				success: function() {
					addressForm.reset();
					$('.content>ul.address-wrapper').empty();
					updateAddressList();
				}
			})
		}
	} else {
		alert('请填写完整的收货地址信息。');
		return;
	}
});

//修改
$('.save-address').click(function() {
	if(addressForm.mode.value !== '0') {
		return;
	}
	else {
		var receiveName = $('input.name-input').val();
		var receiveTel = $('input.phone-input').val();
		var receiveAddress = $('a.btn-info').text();
		var id = $(this).closest('form.edit-form').attr('data-id');
		myHttp({
			type: 'post',
			url: '/address/update',
			data: {
				receiveName: receiveName,
				receiveTel: receiveTel,
				receiveAddress: receiveAddress,
				id: id
			},
			success: function() {
				addressForm.reset();
				var lis = $('ul.address-wrapper li');
				for(var i = 0; i < lis.length; i++) {
					if(lis.eq(i).attr('data-id') === id) {
						lis.eq(i).find('input.name-input').text(receiveName);
						lis.eq(i).find('input.phone-input').text(receiveTel);
						lis.eq(i).find('span.address').text(receiveAddress);
					}
				}
				$('ul.address-wrapper').empty();
				updateAddressList();
			}
		});
	}
})

//数据请求
function updateAddressList() {
	myHttp({
		type: 'post',
		url: '/address/list',
		data: { name: name },
		success:function(data) {
			getAddressList(data);
		}
	});
}
updateAddressList();



