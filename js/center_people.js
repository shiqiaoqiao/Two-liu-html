//js解析url 获取请求参数   (返回来源页)
function getQueryString(name,def) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return r[2];
    }
    return def;
};

$(document).ready(function(){

    //获取用户信息
    $.ajax({
        url:'http://book.798artplus.com/api/v1/011',
        type:'get',
        dataType:'json',
        data:{
          token:getCookie("Liutoken"),
          start:0,
          fetchsize:10,
          time:new Date().getTime()
        },
        success:function(data){

             checkToken();
             if(data.rows&&data.rows.length>0){
                  $("#peopleTxt").html(template('peopleList',data));
                  var Address = "";
                  if (data.rows[0].address && data.rows[0].address.length > 0) {
                      Address = JSON.parse(data.rows[0].address);
                  }
                  if (Address && Address.province && Address.city && Address.area && Address.address) {
                      $('#adress').val(Address.province + Address.city + Address.area + Address.address); //地址
                  } else {
                      $('#adress').val('');
                      $("#updateBtn2").text("添加");
                  }

                 if(data.rows[0].pic.length>=0){
                     $("#userpic").attr('src',data.rows[0].pic);    //头像
                 }else{
                     $("#userpic").attr('src','http://book.798artplus.com/html/image/b3.jpg');    //头像
                 }
                 $("#userpic").attr('userId',data.rows[0].id);  //id

                  $(".Sex").each(function(i) {
                     if($(this).attr('sex')==$(this).attr('select-sex')){
                          $(this).addClass('active');
                     }
                  });

                  //判断是否有地址
                  if (!Address && !Address.province && !Address.city && !Address.area && !Address.address) {
                      $("#updateBtn2").text("添加");
                      new PCAS("province", "city", "area", "北京市", "北京市", "海淀区");
                      $('#adress').val("");
                      $("#updateBtn2").text("添加");
                  } else {
                      $("#updateBtn2").text("修改");

                      new PCAS("province", "city", "area", Address.province, Address.city, Address.area);
                  }


                  //修改信息状态
                  $(".updateBtn").click(function() {

                      $(this).css("display","none");
                      $('#peopleTxt input').attr('disabled',false).css('border','solid 1px #eee');
                      $('#username').focus();
                      $('.saveBtn').css('display','block');
                      $('.Sex').css('display','inline-block');
                      $('.Sex').css({'background':'#eee','color':'#333'});
                      $('.Sex').eq(1).css('display','none');
                      $('.Sex.active').css({'background':'#00cfe2','color':'#fff'});
                      $('.Sex').click(function(){
                          $(this).attr('id','userSex');
                          $(this).addClass('active').siblings().removeClass('active');
                          $(this).css({'background':'#00cfe2','color':'#fff'}).siblings().css({'background':'#eee','color':'#333','display':'inline-block'});
                          $('.Sex').eq(1).css('display','none');
                      });

                  });
                  $('#updateBtn2').click(function(){
                      $(this).css("display","none").text("修改");
                      $(".changeAdress").css("display","block");
                      $('.adrs input').attr('disabled',false).css('border','solid 1px #eee');
                      $('#adress').val(Address.address);
                      $('.saveTBtn').css('display','block');
                  });

                  //修改用户信息
                  $('.saveBtn').click(function(){

                       var data1={
                            id:$('#userpic').attr('userId'),
                            token:getCookie("Liutoken"),
                            nickName:$('#username').val(),
                            sex:$('#userSex').attr('select-sex'),
                            phone:$('#userphone').val(),
                            time:new Date().getTime()
                       };
                       var reg_phone=/^1[3|4|5|7|8]\d{9}$/;
                       if($('#userphone').val().search(reg_phone)>-1){
                           saveData(data1);
                           $('.saveBtn').css('display','none');
                           $(".updateBtn").css("display",'inline-block');
                       }else{
                          alert('手机号格式不正确!');
                       }
                          $('.Sex.active').css({'background':'none','color':'#00cfe2'});
                          $('.Sex').attr('style','');

                  });
                  //修改地址
                  $('.saveTBtn').click(function(){
                      var data2={
                          id:$('#userpic').attr('userId'),
                          token:getCookie("Liutoken"),
                          province:$('#pro').val(),
                          city:$('#city').val(),
                          area:$('#area').val(),
                          address:$('#adress').val(),
                          time:new Date().getTime()
                      }
                      if($.trim($('#adress').val()).length<=0){
                          alert('快递地址不能为空！');
                      }else{
                          saveData(data2);
                          $(".changeAdress").css("display","none");
                          $('.saveTBtn').css('display','none');
                          $("#updateBtn2").css("display","inline-block");
                          $('#adress').val($('#pro').val()+$('#city').val()+$('#area').val()+$('#adress').val());        //地址
                          var newAdress=data2.address;

                          //$('#adress').val($('#adress').val())

                          //保存具体地址从新取值
                          $('#updateBtn2').click(function(){
                            $(this).css("display","none").text("修改");
                            $(".changeAdress").css("display","block");
                            $('.adrs input').attr('disabled',false).css('border','solid 1px #eee');
                            $('#adress').val(newAdress);
                            // $('#adress').focus();
                            $('.saveTBtn').css('display','block');
                        });


                      }
                  })
             }else{
                   $("#peopleTxt").html('暂无用户信息！');
             }
        }
    });

    //修改用户信息
    function saveData(datas){
        $.ajax({
             url:'http://book.798artplus.com/api/v1/012',
             type:'get',
             dataType:'json',
             data:datas,
             success:function(data){
                 if(data.message=="success"){
                    $('.main input').attr('disabled',true).css('border','none');
                    $('#adress').attr('disbled',true).css('border','none');
                    //$('#adress').val(datas.address);
                 }else{
                   alert(data.message);
                 }
             }
        });
    };

    //我参与的漂流
    $.ajax({
        url:'http://book.798artplus.com/api/v1/007',
        type:'get',
        dataType:'json',
        data:{
            token:getCookie("Liutoken"),
            userId:getCookie("userId"),
            start:0,
            fetchsize:100,
            time:new Date().getTime()
        },
        success:function(data){
            $('#loading').css('display','none');
                $('body').css('background','#f0f0f0');
            if(data.rows&&data.rows.length>0){

                 $('#Book_Drift').html(template('DriftBook',data));
                 $('#AllBook_Drift').html(template('DriftBook',data));

                 $('.All_Book_img a').on('click',function(){
                      $('.mapTxt').html(" ");
                     // var Abkid =$(this).attr('bookId');
                      var Abkcode =$(this).attr('bookCode');
                      $("#MAP").css('display','block');
                      maps(Abkcode);
                  });

            }else{
              $('#Book_Drift').html("<p>暂无数据！</p>");
              $('#AllBook_Drift').html("<p>暂无数据！</p>");
            }
        }
    });

     // 百度地图API功能
        var map = new BMap.Map("l-map");
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 5);
        map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
        map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
        map.addControl(new BMap.OverviewMapControl()); //添加缩略地图控件
        var index = 0;
        var myGeo = new BMap.Geocoder();
        var adds = [];

        //地址转换为经纬度
        function bdGEO() {
            var add = adds[index];
            geocodeSearch(add);
            index++;
        }

        function driver() {
            map.clearOverlays(); //清除地图上所有的覆盖物
            var driving = new BMap.DrivingRoute(map); //创建驾车实例
            for (var i = 0, len = adds.length; i < len; i++) {
                if (i < len - 1) {
                    driving.search(adds[i], adds[i + 1]); //第一个驾车搜索
                }
            }
        };

        function geocodeSearch(add) {
            if (index < adds.length) {
                setTimeout(window.bdGEO, 400);
            }
            myGeo.getPoint(add, function(point) {
                if (point) {
                    var address = new BMap.Point(point.lng, point.lat);
                    addMarker(address, new BMap.Label(index + ":" + add, {
                        offset: new BMap.Size(20, -10)
                    }));
                }
            });
        }
        // 编写自定义函数,创建标注
        function addMarker(point, label) {
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            marker.setLabel(label);
        }
    //漂流轨迹
    function maps(code){
        $.ajax({
            type: 'GET',
            url: 'http://book.798artplus.com/api/v1/008',
            dataType: 'json',
            data:{
                bookCode:code,
                start:0,
                fetchsize:100,
                time:new Date().getTime()
            },
            success: function(data) {
                if(data.rows&&data.rows.length>0){
                  for(var i=0;i<data.rows.length;i++){
                    var  html="<span>第"+parseInt(i+1)+"家漂流地址："+data.rows[i].address+"</span>";
                  }
                  $('.mapTxt').append(html);
                  adds = data.rows;
                  bdGEO();
                  driver();
                }else{
                       $('.mapTxt').html("暂无数据！");
                }
            }
        })
    };
 })