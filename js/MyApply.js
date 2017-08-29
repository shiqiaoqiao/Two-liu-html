$(document).ready(function(){
       new PCAS("province","city","area","北京市","北京市","海淀区");

       //js解析url 获取请求参数
        function getQueryString(name,def) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return r[2];
            }
            return def;
        }
      //解析url获取-数据
       var bookIdval=getQueryString('bookId');
       $("#Token").val(getCookie("Liutoken"));
       $("#userId").val(getCookie("userId"));
       $("#bookId").val(bookIdval);


       var reg_phone=/^1[3|4|5|7|8]\d{9}$/;   //手机
       var userNameCode=0,userPhoneCode=0,yjAdressCode=0,userAddressCode=0,sjpenpleCode=0,userId=0,bookId=0;

        var bookname = decodeURI(getQueryString('bookname'));
        $('#Sbookname').val(bookname);

         var p = $('#pro').val();
         var c =$('#city').val();
         var a =$('#area').val();

         var myGeo = new BMap.Geocoder();

         myGeo.getPoint(p+c+a, function(point) {
              if (point) {
                   $('#jingdu').val(point.lng);  //精度
                   $('#weidu').val(point.lat);   //维度
              }
         });

         $("#area").change(function() {
               p = $('#pro').val();
               c =$('#city').val();
               a =$('#area').val();

               var myGeo = new BMap.Geocoder();

               myGeo.getPoint(p+c+a, function(point) {
                    if (point) {
                         $('#jingdu').val(point.lng);  //精度
                         $('#weidu').val(point.lat);   //维度
                    }
               });
         });

       $('#address').blur(function() {

           if($.trim($('#address').val()).length<=0){
                $('#address').siblings('span').html('详细地址不能为空!');
                userAddressCode=0;
            } else{
                 $('#address').siblings('span').css('display','none');
                 userAddressCode=1;
            }
       });

       $('#username').blur(function(){
             if($.trim($('#username').val()).length<=0){
                 $('#username').siblings('span').html('申请人不能为空!');
                 userNameCode=0;
             }
             else{
                userNameCode=1;
                $('#username').siblings('span').css('display','none');
             }
       });

       $('#phone').blur(function(){
            if($.trim($('#phone').val()).length<=0){
                $('#phone').siblings('span').html('手机号不能为空!');
                userPhoneCode=0;
            }else{
                if($('#phone').val().search(reg_phone)>-1){
                     userPhoneCode=1;
                     $('#phone').siblings('span').css('display','none');
                 }else{
                    $('#phone').siblings('span').html('手机号格式不正确!');
                 }
            }
       })

       $('#receiveName').blur(function(){
            if($.trim($('#receiveName').val()).length<=0){
                $('#receiveName').siblings('span').html('收件人不能为空!');
                sjpenpleCode=0;
            }else{
                sjpenpleCode=1;
                $('#receiveName').siblings('span').css('display','none');
            }
       });

       $("#submintBtn").click(function(){
            if($.trim($('#pro').val()).length<=0){
                 $('#pro').parents('strong').siblings('span').html('邮寄地址不能为空!');
                 yjAdressCode=0;
            }else{
                 yjAdressCode=1;
            }
            if($.trim($('#address').val()).length<=0){
                $('#address').siblings('span').html('详细地址不能为空!');
                userAddressCode=0;
            } else{
                 $('#address').siblings('span').css('display','none');
                 userAddressCode=1;
            }
            if($.trim($('#username').val()).length<=0){
                 $('#username').siblings('span').html('申请人不能为空!');
                 userNameCode=0;
             }
             else{
                userNameCode=1;
                $('#username').siblings('span').css('display','none');
             }
             if($.trim($('#phone').val()).length<=0){
                $('#phone').siblings('span').html('手机号不能为空!');
                userPhoneCode=0;
            }else{
                if($('#phone').val().search(reg_phone)>-1){
                     userPhoneCode=1;
                     $('#phone').siblings('span').css('display','none');
                 }else{
                    $('#phone').siblings('span').html('手机号格式不正确!');
                 }
            }
            if($.trim($('#receiveName').val()).length<=0){
                $('#receiveName').siblings('span').html('收件人不能为空!');
                sjpenpleCode=0;
            }else{
                sjpenpleCode=1;
                $('#receiveName').siblings('span').css('display','none');
            }

            if($.trim($('#userId').val()).length>0){
                userId=1;
            }else{
                userId=0;
            }
           if($.trim($('#bookId').val()).length>0){
               bookId=1;
           }else{
               bookId=0;
           }
            if(userNameCode==1 && userPhoneCode==1 && yjAdressCode==1 && userAddressCode==1 && sjpenpleCode==1 && userId==1 && bookId==1){
                $("#Forms").submit();
            }else{
              return false;
            }
       })
  })
