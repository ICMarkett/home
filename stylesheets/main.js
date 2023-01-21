let startTime = new Date()

let clone = (obj) => {
	if (Array.isArray(obj)) {
		return obj.concat()
	} else {
		let clone = {}
		Object.keys(obj).forEach((key) => {
			clone[key] = obj[key]
		})
		return clone
	}
}

let isMobile = function () {
	try {
		document.createEvent("TouchEvent")
		return true
	} catch (e) {
		return false
	}
}

$(function() {
	$( ".popup-click" ).on( "click", function(a) {
		var btnId = $(this).attr('id');
		if($('.popup-modal').hasClass(btnId)) {
			$('.popup-modal').addClass('active')
			a.stopPropagation()
		}
	});
	$(document).on("click", function(a) {
	  if ($(a.target).is(".popup-modal .wrap") === false) {
		$(".popup-modal").removeClass("active");
	  }
	});
  });