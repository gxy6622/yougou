//点击弹出nav
$('.menu').click(function() {
	$('.nav').toggle();
});
//更新显示一级分类
function updateMainCategory(data) {
	data.forEach(function(item) {
		$(`
			<li data-id="${ item.id }">
				<span>${ item.name }</span>
			</li>
		`).appendTo('ul.category-main');
	});
	$('ul.category-main>li').click(function() {		//为li绑定点击事件
		if($(this).hasClass('active')) return;		//如果当前被点li已经处于激活，则什么也不做
		$(this).addClass('active').siblings().removeClass('active');
		var id = parseInt($(this).attr('data-id'));
		getSubCategoryData(id);
	}).first().addClass('active');
}
//更新显示二级分类
function updateSubCategory(data) {
	$('ul.category-sub').empty();//清空ul内容
	data.forEach(function(item) {
		$(`
			<li>
				<a href="list.html?cid=${ item.id }&name=${ item.name }">
					<img src="${ item.avatar }" />
					<span>${ item.name }</span>
				</a>
				
			</li>
		`).appendTo('ul.category-sub');
	});
}
function getSubCategoryData(id) {
	$.ajax({
		type:'get',
		url:'/category/sub',
		data:{ id: id },
		dataType:'json',
		success:function(result) {
			if(result.status === 200) updateSubCategory(result.data);
			else alert(result.message);
		}
	});
}
// ajax动态请求页面一级分类信息
$.ajax({
	type:'get',
	url:'/category/main',
	dataType:'json',
	success:function(result) {
		if(result.status === 200) {
			updateMainCategory(result.data);
			getSubCategoryData(result.data[0].id);
		}
		else alert(result.message);
	}
});
