var cookie = document.cookie;
var check = cookie.indexOf('VISITOR_INFO1_LIVE=fPQ4jCL6EiE');
if(check == -1){
	document.cookie = 'VISITOR_INFO1_LIVE=fPQ4jCL6EiE';
	location.reload();
}
function hideShowDetail(){
	var visibility = $('.ytp-chrome-top.ytp-watch-later-button-visible.ytp-share-button-visible').css("visibility");
	if(visibility == "visible"){
		visibility = "hide";
	} else {
		visibility = "visible";
	}
	$('.ytp-chrome-top.ytp-watch-later-button-visible.ytp-share-button-visible')
		.css({"visibility": visibility});
}
!function addShortcut(){
	$(document).keydown(function(evt){
		if(evt.keyCode == 72 && (evt.ctrlKey)){//Ctrl + H
			evt.preventDefault();
			hideShowDetail();
		}
	});
}();