define(function(require) {
    require('jquery');
    require('bootstrap');
    require('swiper');
    require('django-csrf-support');
    require('velocity');
	$=jQuery.noConflict();
    
	var provet = {
		check_circle:function() {
			var text = $(".circle_num").val();
            var regu = /^\d{3}$/;
	        var re = new RegExp(regu);
            if(text.match(re)){
                return true;
            }
            else {
                return false;
            }
        },
		check_top:function() {
			var text = $(".top_num").val();
			var regu = /^\d{8}$/;
            var re = new RegExp(regu);
            if(text.match(re))	{
				return true;
			}
			else {
				return false;
			}
		},
        check_pro:function(circle,top) {
            //ajax请求接口查询罐码是否正确
            //post过去circle,top
            $.post("//",{
                "circle":circle,
                "top":top
            },function(data){
                if(data.statu=="success")   {
                    return true;
                }
                else {
                    return false;
                }
            });

        },
        check:function(){
            if(provet.check_top()&&provet.check_circle()){
                return true;
            }
            else {
                return false;
            }
        },
        post_pro:function(openID) {
            $.post("/promotion/pro_mobvet/",{
                "circle":$(".circle_num").val(),
                "top":$(".top_num").val(),
                "openID":openID
            },function(data){
                $("html").html(data);
            },"html");
        }
	};
    var mobvet = {
        check_mobile:function() {
            var text = $(".mobile").val();

            var regu = /^\d{11}$/;
            var re = new RegExp(regu);
            if(text.match(re))  {
                return true;

            }
            else {
                return false;
            }
        }
    };
    var postticket = {
        postVotes :function (StudentId,openID) {
            $.post("/promotion/postticket/",{
                "StudentId":StudentId,
                "openID":openID
            },function(data){
                var height = document.documentElement.clientHeight;
                $(".pop-window").html($(data).nextAll("div").html());
                pop_height = $(".pop-window").css("height");
                pop_height = pop_height.substr(0,pop_height.length-2);
                
                height = (height - pop_height)/2;
                $(".pop-window").css({"top":height+"px"});
                
                $(".pop-window").velocity("fadeIn");
                setTimeout(function(){
                    $(".pop-window").velocity('fadeOut',function(){
                        $(".pop-window").html("");
                    });
                },1000);
                //更新票数
                $.post("/promotion/getticket/",{
                    "sid":StudentId
                },function(data){
                    $("#"+StudentId).prevAll(".board_ticket").html(data.vote+1+"票");
                });
            },"html");
        }
    };
    var ajax_window = {
        show_window :function(src) {
            var height = document.documentElement.clientHeight;
            var pop_height ;
            $(".backblur").addClass("blur");
            $.get(src,function(data){
                $(".pop-window").html($(data).nextAll("div").html());
                pop_height = $(".pop-window").css("height");
                pop_height = pop_height.substr(0,pop_height.length-2);
                
                height = (height - pop_height)/2;
                $(".pop-window").css({"top":height+"px","position":"fixed"});
                
                $(".pop-window").velocity("fadeIn");
            },"html");  
        }
    }
	$(function(){
        if(!window.localStorage['openID'])    {
            window.localStorage['openID'] = Date.parse(new Date());  
        }
        else {
            var openID = window.localStorage.openID;
        }
        //跳转到相应学员
        var mySwiper = new Swiper('.swiper-container',{
            //Your options here:
            loop:true,
            mode:'vertical',
            //etc..
        });  
      
		
        $(".postticket").click(function(){

            var StudentId = $(this).attr("id");
            postticket.postVotes(StudentId,openID);
        }) ;
        $(document).on("click",".go_check",function(){
            if(!provet.check()){
                ajax_window.show_window("/promotion/proerror/");
            }
            else {
                 $.post("/promotion/pro_mobvet/" ,{
                    "circle":$(".circle_num").val(),
                    "top":$(".top_num").val(),
                    "openID":openID
                },function(data){
                    $(".pop-window").html($(data).nextAll("div").html());
                    pop_height = $(".pop-window").css("height");
                    pop_height = pop_height.substr(0,pop_height.length-2);
                    
                    height = (height - pop_height)/2;
                    $(".pop-window").css({"top":height+"px"});
                    
                    $(".pop-window").velocity("fadeIn");
                });
            }
        });
        $(".instruction_link").click(function(){
            ajax_window.show_window("/promotion/instruction/");
        });
        $(".provet_link").click(function(){
            ajax_window.show_window("/promotion/provet/");
        });
        $(".mobvet_link").click(function(){
            ajax_window.show_window("/promotion/mobvet/");
        });
        $(document).on("click",".Can_re",function(){
            ajax_window.show_window("/promotion/provet/");
        });
        $(document).on("click",".Can_mob_re",function(){
            ajax_window.show_window("/promotion/pro_mobvet/");
        });
        $(document).on("click",".mob_re",function(){
            ajax_window.show_window("/promotion/mobvet/");
        });
        $(document).on("click",".pro_mobcheck",function(){
            if(!mobvet.check_mobile())   {
                ajax_window.show_window("/promotion/proerror_mobile/");
            }
            else {
                $.post("/promotion/vet/",{
                    "circle":$(".circle").val(),
                    "top":$(".top").val(),
                    "mobile":$(".mobile").val()
                },function(data){
                    location.href="/promotion/vet/";
                });
            }
        });
        $(document).on("click",".mob_check",function(){
            if(!mobvet.check_mobile())   {
                ajax_window.show_window("/promotion/error_mobile/");
            }
            else {

                $.post("/promotion/mobvet_post/",{
                    "mobile":$(".mobile").val(),
                    "openID":openID
                },function(data){
                    location.href="/promotion/mobvet_post/";
                });
            }
        });
        $(document).on("click",".pop-close",function(){
            $(".pop-window").velocity('fadeOut',function(){
                $(".pop-window").html("");
            });
            $(".backblur").removeClass("blur");
        });
	});
});
