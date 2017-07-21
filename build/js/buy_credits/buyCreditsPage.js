var buyCreditsPage = {
	submit: function(obj) {
		console.log('req_');
		
		var this_ = $(obj),
			data_ = this_.serialize();
			req_ = buyCreditsPage.ajax_req(data_);

		console.log(req_);
	},
	ajax_req: function(data){
		var req_ = false;
		$.ajax({
			url: '/path/to/file',
			type: 'POST',
			dataType: 'json',
			data: {
				param1: 'value1'
			},
			success: function(success){
				console.log(success);
				req_ = success;
			},
			error: function(error){
				console.log(error);
			}
		})
		return req_;
	}
}

$(document).ready(function() { new WOW().init(); });
$(document).on('submit', '#promoCode', function(e){
	e.preventDefault();
	e.stopPropagation();
	buyCreditsPage.submit(this);
});