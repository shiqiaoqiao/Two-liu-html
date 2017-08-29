$(document).ready(function() {
    //评价星星
      var isSelect = false;
      var num = document.getElementById('n_rating');
      var scoreTxt= document.getElementById("rateword");
      var Box = document.getElementById("Start");
      var AStart = Box.children;
      for(var i=0;i<AStart.length;i++){
          AStart[i].index=i;
          AStart[i].onmouseover=function(){
              isSelect=false;
              addClass(this.index);
          };

           AStart[i].onmouseout=function(){
                if(!isSelect){
                    for(var i=0;i<AStart.length;i++){
                        AStart[i].className="";
                    }
                     scoreTxt.innerHTML="";
                }

                if(num.value.length>0){
                var allnum = parseInt(num.value-1);   //选中的第几个
                     isSelect=true;

                     for(var j=0;j<=allnum;j++){
                        AStart[j].className="on";
                     }
                     if(allnum==0){
                        scoreTxt.innerHTML="很差";
                     }else if(allnum==1){
                        scoreTxt.innerHTML="较差";
                     }else if(allnum==2){
                        scoreTxt.innerHTML="还行";
                     }else if(allnum==3){
                        scoreTxt.innerHTML="推荐";
                     }else if(allnum==4){
                        scoreTxt.innerHTML="力荐";
                     }
              }
           };

           AStart[i].onclick=function(){
              isSelect=true;
              addClass(this.index);
              num.value=parseInt(this.index+1);
           }
      };
      function addClass(obj){
        for(var j=0;j<AStart.length;j++){
             if(obj>=j){
                 AStart[j].className="on";
             }else{
                 AStart[j].className="";
             }
             switch(obj){
                case 0:
                    scoreTxt.innerHTML="很差";
                    break;
                case 1:
                    scoreTxt.innerHTML="较差";
                    break;
                case 2:
                    scoreTxt.innerHTML="还行";
                    break;
                case 3:
                    scoreTxt.innerHTML="推荐";
                    break;
                case 4:
                    scoreTxt.innerHTML="力荐";
                    break;
             }
         }
      };

    //解析url获取-数据
    var Aid = getQueryString('id');
    var Ablid = getQueryString('bookid');
    var Abookname = decodeURI(getQueryString('bookname'));
    var Ades = decodeURI(getQueryString('des'));
    var Ayajin = getQueryString('yajin');
    var AauthorName = decodeURI(getQueryString('authorName'));
    var Aimage = decodeURI(getQueryString('images'));
    var Apublisher = decodeURI(getQueryString('publisher'));
    var Acount = getQueryString('count');
    var AselCount = getQueryString('selCount');
    var driftCount = parseInt(Acount - AselCount);
    var startNum = $("#n_rating").val();    //评分
    var obj = {
        data: {
            "id": Aid,
            "bookid": Ablid,
            "des": Ades,
            "yajin": Ayajin,
            "authorName": AauthorName,
            "image": Aimage,
            "bookname": Abookname,
            "publisher": Apublisher,
            "driftCount": driftCount
        }
    }

    $('#bookImg').html(template("dataBookImg", obj));

    //添加评论
    $("#btnSend").click(function() {
        if ($("#n_rating").val().length > 0 && $('#Message').val().length > 0 ) {
              $.ajax({
                url: 'http://book.798artplus.com/api/v1/004?token=' + getCookie("Liutoken"),
                type: 'get',
                dataType: 'json',
                data: {
                    userId: getCookie("userId"),
                    userName: decodeURI(getCookie("userName")),
                    bookId: Ablid,
                    bookName: Abookname,
                    content: $("#Message").val(),
                    score: startNum,
                    start: 1,
                    fetchsize: 100,
                    time: new Date().getTime()
                },
                success: function(data) {
                    if (data.code == 0) {
                        listPL();
                        $(".Start a").removeClass('on');
                        $(".pl").text("");
                        $("#n_rating").val("");
                        $("#comment").val("");
                        $('#Message').val('');
                    } else {
                        alert(data.message);
                    }
                }
            });
        } else {
            alert('评分或内容不能为空');
        }
    });

    //评论列表
    function listPL() {
        $.ajax({
            url: 'http://book.798artplus.com/api/v1/005',
            type: 'get',
            dataType: 'json',
            data: {
                bookId: Ablid,
                start: 0,
                fetchsize: 100,
                time: new Date().getTime()
            },
            beforeSend: function() {
                $('.loading').css('display', 'block');
                $('body').css('background', '#fff');
            },
            success: function(data) {
                $('.loading').css('display', 'none');
                $('body').css('background', '#f0f0f0');
                if (data.rows && data.rows.length > 0) {
                    $("#book_comment").html(template('Comment', data));
                } else {
                    $("#book_comment").html("<p> 暂时还没有评论哦！</p>");
                }
            }
        });
    }
    listPL();
    //评论滚动
    $('.BigBtn').click(function() {
        $(this).css('color', '#fff');
        $('textarea').focus();
        $('.Iscroll').scrollTop($('.Iscroll .row').height());
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
        //map.clearOverlays(); //清除地图上所有的覆盖物

        var driving = new BMap.DrivingRoute(map); //创建驾车实例

        var lines = [];
        for (var i = 0, len = adds.length; i < len; i++) {
            lines.push(new BMap.Point(adds[i].jingdu, adds[i].weidu));
        }
        // var polyline = new BMap.Polyline(lines, { strokeColor: "blue", strokeWeight: 6, strokeOpacity: 0.5 });
        // map.addOverlay(polyline);

    };

    function geocodeSearch(add) {
        if (index < adds.length - 1) {
            setTimeout(bdGEO, 1000);
        }
        try {

            if (add.jingdu && add.weidu) {
                var address = new BMap.Point(add.jingdu, add.weidu);
                addMarker(address, new BMap.Label(index + 1 + ":" + add.address, {
                    offset: new BMap.Size(20, -10)
                }));
            } else {
                console.log("您选择地址" + add + "没有解析到结果!");
            }
        } catch (ex) {
            alert('地址:' + add + '解析失败');

        }
    }
    // 编写自定义函数,创建标注
    function addMarker(point, label) {
        try {
            var marker = new BMap.Marker(point);
            map.addOverlay(marker);
            marker.setLabel(label);
        } catch (ex) {
            alert('地址:' + label + '解析失败');

        }
    }

    //漂流轨迹
    $.ajax({
        type: 'GET',
        url: 'http://book.798artplus.com/api/v1/008',
        dataType: 'json',
        data: {
            bookId: Ablid,
            start: 0,
            fetchsize: 100,
            time: new Date().getTime()
        },
        success: function(data) {
            if (data.rows && data.rows.length > 0) {

                $('#mapTxt').html(template("list_adress", data));
                var arr = [];
                for (var i = 0; i < data.rows.length; i++) {
                    arr.push({
                        address: data.rows[i].province + data.rows[i].city + data.rows[i].area,
                        jingdu: data.rows[i].jingDu,
                        weidu: data.rows[i].weiDu
                    });
                }
                console.log(arr);
                adds = arr;
                bdGEO();
                driver();
            } else {
                $('#mapTxt').html("<strong>暂无数据！</strong>");
            }
        },

    })
})
