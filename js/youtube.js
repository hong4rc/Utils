var cookie = document.cookie;
var check = cookie.indexOf('VISITOR_INFO1_LIVE=fPQ4jCL6EiE');
if (check == -1) {
	document.cookie = 'VISITOR_INFO1_LIVE=fPQ4jCL6EiE';
	location.reload();
}