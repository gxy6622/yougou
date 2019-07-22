$('span[class^=title]').click(function() {
	$(this).addClass('active').siblings().removeClass('active');
	$('.login-phone,.login-pwd').toggle();
});
$('.login-pwd .pwd-img').click(function() {
	$('.login-pwd .pwd-img>img').toggle();
});
//获取验证码
$('.code').click(function() {
	myHttp({
		type:'get',
		url:'/login/getcode',
		success:function(data) {
			$('.code').text(data);
		}
	});
});
//手机登录
$('.btn-phone').click(function() {
	if($('.phone').val() === '') alert('手机号不能为空..'); return;
	if($('.code').text() !== $('.scode').val().toUpperCase()) {
		alert('验证码错误..');
		return;
	}
	myHttp({
		type:'post',
		url:'/login/phone',
		data:{
			phone:$('.phone').val(),
			code:$('.scode').val()
		},
		success:function(data) {
			window.location.href = Cookies.get('target');
		}
	});
});
//密码登录
$('.btn-pwd').click(function() {
	myHttp({
		type:'post',
		url:'/login/pwd',
		data:{
			account:$('.account').val(),
			pwd:$('.pwd').val()
		},
		success:function(data) {
			window.location.href = Cookies.get('target');
		}
	});
});