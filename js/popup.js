count_like();
$(document).ready(function(){
	$("#like-btn").click(like);
	$("#unlike-btn").click(unlike);
});

function count_like() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {fbLike: "getLike"}, function(response) {
			$("#number_like").html(response.like);
			$("#number_unlike").html(response.unlike);
		});
	});
}


function like() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {fbLike: "like"}, function(response) {
			$("#like-btn span").html("Đã like tất cả " + response.number + "  mục");
			$("#like-btn").fadeOut(2000);
			setTimeout(function(){
				$("#like-btn span").html("Like All");
			}, 2000);
			$("#like-btn").fadeIn(100);
			count_like();
		});
	});
}


function unlike() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {fbLike: "unlike"}, function(response) {
			$("#unlike-btn span").html("Đã unlike tất cả " + response.number + "  mục");
			$("#unlike-btn").fadeOut(2000);
			setTimeout(function(){
				$("#unlike-btn span").html("UnLike All");
			},2000);
			$("#unlike-btn").fadeIn(100);
			count_like();
		});
	});
}