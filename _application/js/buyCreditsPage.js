var clock,
// ------------------------------------
// Default variables
// ------------------------------------
ratePlanClass = 'rateplan',					// Rateplan default class
promoActiveClass = 'update',				// Class for the elements of the rateplan with an active promo
inputCostSend = 'input[name="cost"]',		// Input cost. To send with a form
activeRateplanClass = 'activeRateplan',		// Class for selected (active) rateplan
// ------------------------------------
// Details setcion (rateplan)
// ------------------------------------
detail_creditsCount = '.infoTitleCredits .credits',  // Detail credits count wrapper
rateplanDetailsWrapper = '.rateplanDetails', 	     // Rateplan details wrapper class
detail_chatMinutes = '.minutesCount',				 // Detail chat minutes wrapper
detail_contacts = '.contactsCount',					 // Detail contacts count wrapper
detail_msgCount = '.msgCount',						 // Detail messages count wrapper
detail_class = '.detail', 							 // Detail item class
detail_pv = '.girlCount',				 			 // Detail photo & video count wrapper
// ------------------------------------
// Object data-attribute (rateplan)
// ------------------------------------
data_msg = 'data-msg', 						// messages count
data_girl = 'data-girl', 					// premium photo & video count
data_cost = 'data-cost', 					// tarif cost with promo
data_min = 'data-minutes',					// chat minutes
data_credits = 'data-credits';				// credits count with promo
data_tarif = 'data-tarif-cost', 			// tarif cost original
data_contacts = 'data-contacts',			// contacts count
// ------------------------------------
// Object other variables
// ------------------------------------
one_credit_price = '.item-price > span', 	// one credits price rateplan
creditsValue = '.creditsValue',			 	// curremt credits count rateplan
procent_wrapper = '.discount',				// procent wrapper rateplan
priceValue = '.priceValue',				 	// current price value rateplan
price_wrapper = '.price',				 	// price wrapper rateplan
oldVal = '.oldValue',					 	// class for old values rateplan
// ------------------------------------
buyCreditsPage = {
// ------------------------------------
	// Submit promocode form function
// ------------------------------------
	submit: function(obj) {
		var this_ = $(obj),
			data_ = this_.serialize();

		$.ajax({
			url: '/js/html/promocode/index.html',
			type: 'POST',
			dataType: 'json',
			data: data_,
			success: function(data){
				console.log(data);
				if(data.length > 1){
					buyCreditsPage.promoApply(data, true);
				}
				else {
					var link = data[0].link,
						mess = data[0].mess,
						type = data[0].type;

					if(type == "" || type == ' '){
						$(document).find('.errorMess').text(mess).show();
						$(document).click(function(){$(document).find('.errorMess').hide();});
					}else{
						location.href = link;
					}
				}
			},
			error: function(error){
				console.log(error);
			}
		})
	},
// ------------------------------------
	// Promocod window - cancel & back buttons action
// ------------------------------------
	cancel: function(obj, type_ = 'cancel'){
		if(type_ == 'cancel'){
			$.ajax({
				url: '/js/html/promocode/delete.html',
				type: 'POST',
				dataType: 'json',
				success: function(data){
					console.log(data);
					buyCreditsPage.promoApply(data);
					$('.flip-container.hover').removeClass('hover');
					$('input[name="code"]').val('');
					clock.reset();
				},
				error: function(error){
					console.log(error);
				}
			});
		}
		else if(type_ = 'enter'){
			$('.flip-container.hover').removeClass('hover');
		}
	},
// ------------------------------------
	// Apply/update rateplans function
// ------------------------------------
	promoApply: function(arr_, enter_ = false){
		var promo_time = arr_[0].promo_time;		// Time (sec) promocode active

		arr_.forEach(function(element, index) {
			var bonus_credits = arr_[index].bonus_credits,  // Bonus credits count (To determine the id)
				credits_total = arr_[index].credits_total,  // with promo credits count
				dollars_total = arr_[index].dollars_total,  // with promo price
				one_price_old = arr_[index].one_price_old, 	// OLD Price for one credit
				procent_old = arr_[index].procent_old,		// Procent old
				one_price = arr_[index].one_price, 			// Price for one credit
				contacts = arr_[index].contacts, 			// Contacts count
				messages = arr_[index].messages,  			// Messages count
				procent = arr_[index].procent,				// Procent
				credits = arr_[index].credits, 				// full credits count
				dollars = arr_[index].dollars, 				// full price
				photos = arr_[index].photos, 				// Photos & video count
				chat = arr_[index].chat;					// Chat minutes

			idata_credits = credits !== "" && bonus_credits !== "" ? parseInt(credits) + parseInt(bonus_credits) : (credits == "" && bonus_credits !== "" ? bonus_credits : credits);

			// Elemet сlass definition
			var dollars_id = Math.round(dollars),
				obj_class =  '.' + ratePlanClass + '.id_' + dollars_id + '_' + idata_credits,
				object_ = $(document).find(obj_class);

			// PRINT DOLLARS
			dollars = dollars !== '' && dollars !== ' ' ? eval(dollars) : '';
			dollars_total = dollars_total !== '' && dollars_total !== ' ' ? eval(dollars_total) : '';

			if(dollars !== dollars_total){
				object_	.find(price_wrapper)
						.addClass(promoActiveClass)
						.find(oldVal)
						.text(dollars)
						.next(priceValue)
						.text(dollars_total);
			}else{
				object_.find(price_wrapper)
						.removeClass(promoActiveClass)
						.find(priceValue)
						.text(eval(dollars));
			}
			// PRINT CREDITS
			credits = credits !== '' && credits !== ' ' ? eval(credits) : '';
			bonus_credits = bonus_credits !== '' && bonus_credits !== ' ' ? eval(bonus_credits) : '';
			credits_total = credits_total !== '' && credits_total !== ' ' ? eval(credits_total) : '';

			if(credits_total !== credits + bonus_credits){
				var credits_plus = credits_total - (credits + bonus_credits);
					credits_plus = credits_plus > 0 ? ' + ' + credits_plus : '';

				object_.find(creditsValue)
						.find('.' + promoActiveClass)
						.text(credits_plus);
			}else {
				object_.find(creditsValue)
						.find('.' + promoActiveClass)
						.text('');
			}
			// PRINT ONE PRICE 
			if(one_price_old !== one_price){
				object_.find(one_credit_price)
						.text(one_price)
						.parent()
						.addClass(promoActiveClass);
			}else{
				object_.find(one_credit_price)
						.text(one_price)
						.parent()
						.removeClass(promoActiveClass);
			}
			// PRINT PROCENT
			if(procent_old !== procent){
				procent_old = procent_old > 0 ? procent_old + '%' : '';

				object_.find(procent_wrapper)
						.addClass(promoActiveClass)
						.find(oldVal)
						.text(procent_old)
						.next()
						.text(procent);
			}else{
				object_.find(procent_wrapper)
						.removeClass(promoActiveClass)
						.find(oldVal)
						.text('')
						.next()
						.text(procent);
			}
			// Data attr rateplan element
			object_.attr(data_msg, messages)
					.attr(data_girl, photos)
					.attr(data_cost, dollars)
					.attr(data_min, chat)
					.attr(data_credits, credits_total)
					.attr(data_tarif, credits)
					.attr(data_contacts, contacts);
		});
		
		buyCreditsPage.rateplanChek('.' + activeRateplanClass , 'update');
		if(enter_){ buyCreditsPage.time(promo_time); } else { clock.reset() }
	},
// ------------------------------------
	// Select rateplan function (load details)
// ------------------------------------
	rateplanChek: function(obj, meth = 'effect'){
		var obj_ = $(obj),

			msg = obj_.attr(data_msg),
			girl = obj_.attr(data_girl),
			minutes = obj_.attr(data_min),
			contacts = obj_.attr(data_contacts),
			credits = obj_.attr(data_credits),

			details = $(rateplanDetailsWrapper),
			detail = $(detail_class, details),
			count_msg = $(detail_msgCount, detail),
			count_girl = $(detail_pv, detail),
			count_minutes = $(detail_chatMinutes, detail),
			count_contacts = $(detail_contacts, detail),
			count_credits = $(detail_creditsCount, details);

		function update_details(){
			count_msg.text(msg);
			count_girl.text(girl);
			count_minutes.text(minutes);
			count_credits.text(credits);
			
			if(contacts > 0){ count_contacts.text(contacts); $('.gContacts').css({'opacity' : 1}); }
			else { $('.gContacts').css({'opacity' : 0}); }

			$('.' + activeRateplanClass).removeClass(activeRateplanClass);
			obj_.addClass(activeRateplanClass);
		}

		if(meth == 'update'){ update_details(); }
		else if(meth == 'effect'){
			$('.infoTitleCredits, .detailsList').animate({'opacity' : 0}, 180, function(){
				update_details();
				$('.infoTitleCredits, .detailsList').animate({'opacity' : 1}, 180);
			});
		}
	},
// ------------------------------------
	// Timer promo function
// ------------------------------------
	time: function(time = 0){
		$('.flip-container').addClass('hover');

	    clock = $('.clock').FlipClock(time, {
			clockFace: 'DailyCounter',
			countdown: true,
			showSeconds: false
		});
	},
	myBalancePage: function(){
		new WOW().init(); // Effect css on page init
		buyCreditsPage.rateplanChek('.' + activeRateplanClass); // Select active rateplan

		// Init timer promo
		if($('.flip-container.hover').length > 0) {
			var timeSec = $('.successCode').attr('data-set-time');
			buyCreditsPage.time(timeSec);
		}

		// ---------------------------------------------------
		// 					DOCUMENT ACTIONS
		// ---------------------------------------------------
		$(document)
		// Rateplan details
		.on('click', '.' + ratePlanClass, function(e){
			var input=$(inputCostSend);
			input.val($(this).data('tarif-cost'));
			buyCreditsPage.rateplanChek(this);
		})
		// PromoCode form submit
		.on('submit', '#promoCode', function(e){
			e.preventDefault();
			e.stopPropagation();
			buyCreditsPage.submit(this);
		})
		// HideBlock toggle
		.on('click', '.hideBlockButton', function (e) {
			if ($('.hideBlockInner').hasClass('hiddenInnerBlock')) {
				$('.hideBlockInner').removeClass('hiddenInnerBlock');
				$('.hideBlockInner').animate({height: 216}, function () {
				});
				$(this).find('p').text('hide this');
			} else {
				$('.hideBlockInner').addClass('hiddenInnerBlock');
				$('.hideBlockInner').animate({height: 50});
				$(this).find('p').text('open this');
			}
		});
	}
}

$(document).ready(function() { if($('.payPage').length > 0) buyCreditsPage.myBalancePage(); });
$(document).on('click', '.wrapper-title-mobile', function(){
	var _this = $(this),
		parent = _this.parents('.wrapper-mobile');

	parent.toggleClass('open');
})