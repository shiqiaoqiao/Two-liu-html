
$(document).ready(function(){	
	var groupId= getQueryString('id'); 
	//团漂书详情；
	$.ajax({
		url:'http://group.798artplus.com/api/v1/groupBook/003-groupBookDeailList',
		type:'get',
		dataType:'json',
		data:{
			id:groupId,
			time:new Date().getTime()
		},
		success:function(data){
			if(data.message=="success"){
				$('#list_books').html(template('allBookData',data));
			}else{
				$('#list_books').html('数据加载失败');
			}
										
		}
	});
})