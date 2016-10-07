//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var temp;
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var nextStep;

function Progress(){}

//$(document).ready(function() {
window.onload = function() {
	var stepNextBtn = $('.stepNext');

	if($('#fsSeqSel:visible').length > 0){
		$('#footer').css('margin-top', function(){
			return ($('#fsSeqSel').height() + $('#navbar-first').height() + $('#navbar-second').height());
		});
	};

	if($('#fsOligoOrder:visible').length > 0){
		$('#footer').css('margin-top', function(){
			return ($('#fsOligoOrder').height() + $('#navbar-first').height() + $('#navbar-second').height());
		});
	};

	if($('#fsOligoPersonal:visible').length > 0){
		$('#footer').css('margin-top', function(){
			return ($('#fsOligoPersonal').height() + $('#navbar-first').height() + $('#navbar-second').height());
		});
	};

	if($('#fsOrderReview:visible').length > 0){
		$('#footer').css('margin-top', function(){
			return ($('#fsOrderReview').height() + $('#navbar-first').height() + $('#navbar-second').height());
		});
	};

	if($('#fsOrderConfirmation:visible').length > 0){
		$('#footer').css('margin-top', function(){
			return ($('#fsOrderConfirmation').height() + $('#navbar-first').height() + $('#navbar-second').height());
		});
	};

	Progress.stepNext = function (event){
		var thisElement = this;
		if(event.hasOwnProperty("boundaryChecked")){
			thisElement = event.data;
		}
		if($(thisElement).hasClass('disabled')){
			console.log("Submit1 is disabled!!!");

			$('#footer').css('margin-top', function(){
				return  ($('fieldset:visible').height() + $('#navbar-first').height() + $('#navbar-second').height());
			});
			return;
		}

		if(animating) return false;
		animating = true;

		current_fs = $(thisElement).parent();
		next_fs = $(thisElement).parent().next();
		temp = current_fs.attr('id');

		console.log(temp);

		switch(temp){
			case "fsOrderReview":
				current_fs = $("#fsOrderReview");
				next_fs = $("#fsOligoPersonal");
				break;
			case "fsOligoPersonal":
				current_fs = $("#fsOligoPersonal");
				next_fs = $("#fsOrderSummary");
				$("#fsOrderSummary").find(".removeItemForm").remove();
				var personalArray = $('#fsOligoPersonal').serializeArray();
				$(personalArray).each(function(index, obj){
					$("#fsOrderSummary").find("#" + obj.name).text(obj.value);
				});
				break;
			case "fsOrderSummary":
				current_fs = $("#fsOrderSummary");
				break;
		}
		console.log(next_fs.attr('id'));
		console.log(current_fs.height());
		console.log(next_fs.height());

		//current_fs = $("#fsSeqSel");
		//next_fs = $("#fsDesignOption");

		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		$("#oligoProgressbar li").eq($("fieldset").index(next_fs)).addClass("active");

		//show the next fieldset
		next_fs.show();

		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'transform': 'scale('+scale+')'});
				next_fs.css({'left': left, 'opacity': opacity});
			},
			duration: 800,
			complete: function(){
				current_fs.hide();
				animating = false;
			},
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
		$('#footer').css('margin-top', function(){
			return (next_fs.height() + $('#navbar-first').height() + $('#navbar-second').height());
		});
	};
	$('.stepNext').click(Progress.stepNext);

//};
	$(".previous").click(function(){
		if(animating) return false;
		animating = true;

		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();

		console.log(current_fs.attr('id'));
		console.log(previous_fs.attr('id'));

		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

		//show the previous fieldset
		previous_fs.show();

		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			},
			duration: 400,
			complete: function(){
				current_fs.hide();
				animating = false;
			},
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});

		$('#footer').css('margin-top', function(){
			return (previous_fs.height() + $('#navbar-first').height() + $('#navbar-second').height());
		});

	});

	$(".submit").click(function(){
			return true;
	});

	$('.divCollapse').on('shown.bs.collapse' , function() {
    $(this).prev().find("span").addClass('glyphicon-arrow-down').removeClass('glyphicon-arrow-right');

		var promo = $("input[name=promo]:checked").attr('value');
		console.log(promo);
		var promo_others = $('#promoList option:selected').attr('value');
		if(promo == 'append'){
			if(promo_others == 'Others'){
				$('#promosequence-display').removeClass('invisible');
				$('#footer').css('margin-top', function(){
					return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
				});
			} else{
				$('#promosequence-display').addClass('invisible');
				$('#footer').css('margin-top', function(){
					return ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
				});
			}
		}

		console.log($('#fsDesignOption').height());
		$('#footer').css('margin-top', function(){
			return  ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
		});
  });

	$('.divCollapse').on('hidden.bs.collapse', function() {
    	$(this).prev().find("span").addClass('glyphicon-arrow-right').removeClass('glyphicon-arrow-down');
		if($(this).prev().find("span").hasClass('promoDrop')){
			$("#promosequence-display").addClass('invisible');
		}
		console.log($('#fsDesignOption').height());
		$('#footer').css('margin-top', function(){
			return  ($('#fsDesignOption').height() + $('#navbar-first').height() + $('#navbar-second').height());
		});
	});

	$('#vivoRadio').click(function(){
		$('#envVivo').prop('disabled', false);
	});

	$('#vitroRadio').click(function(){
		$('#envVivo').prop('disabled', true);
	});

	$('#append_promo').click(function(){
		$('#promoList').prop('disabled', false);
	});

	$('#not_append_promo').click(function(){
		$('#promoList').prop('disabled', true);
	});

}
//});
