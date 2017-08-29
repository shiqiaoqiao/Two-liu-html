$(document).ready(function(){      
	  //搜索条件；
	  $.ajax({
		  url:'http://group.798artplus.com/api/v1/groupBook/001-categorList',
		  type:'get',
		  dataType:'json',
		  data:{
			  start:0,
			  fetchsize:10,
			  time:new Date().getTime()
			  },
		  beforeSend:function(){
			  $('#loading').css('display','none');
			  $('body').css('display','block');
		  },
		  success:function(data){
			  if(data.rows&&data.rows.length>0){
				  $('#searchVal').append(template("selectKind",data));
				  $(".NoBorder").each(function(j){
					   $(this).click(function() {
						  var that = $(this);
						  $(this).siblings('.kindBox').css('display', 'block');
						  //选择类别
						  $(".kindBox a").click(function() {
							  $(this).parents().siblings('.inputTit').val($(this).text());
							  $(this).parents('.kindBox').css('display', 'none');
						  });
			
						  $("#kindBox0 a").click(function() {
							  subId = $(this).attr("id");
						  });
						  $("#kindBox0 a").eq(0).click(function() {
							  subId = "";
						  });
			
						  $("#kindBox1 a").click(function() {
							  subNew = $(this).attr("id");
						  });
						  $("#kindBox1 a").eq(0).click(function() {
							  subNew = "";
						  })
			
						  //Two add 全部专题
						  $("#kindBox2 a").click(function() {
							  SearchId = $(this).attr("id");
						  });
						  $("#kindBox2 a").eq(0).click(function() {
							  SearchId = "";
						  })
			
						  //失去焦点隐藏
						  $(".NoBorder").blur(function() {
							  var _this = $(this);
							  setTimeout(function() {
								  _this.siblings('.kindBox').css('display', 'none');
							  }, 2000)
						  });
						  //获取焦点取消默认键盘弹出
						  $(".NoBorder").focus(function() {
							  document.activeElement.blur();
						  });
			
					   });
				  })
				  
			  }else{
				  $('#searchVal').html('<li>数据加载失败</li>');
			  }
		  }
		  });
	$.ajax({
		url:'http://group.798artplus.com/api/v1/groupBook/002-groupBookList',
		type:'get',
		dataType:'json',
		data:{
			start:0,
			fetchsize:100
			},
		beforeSend:function(){
			$('#loading').css('display','none');
			  $('body').css('display','block');
		},
		success:function(data){
			if(data.rows&&data.rows.length>0){
				$('#booklist').append(template("bookList",data));
			}else{
				$('#booklist').html('<li>数据加载失败</li>');
			}
			
		}
	});
})