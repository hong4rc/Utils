function count_like() {
    var number = $(".UFILikeLink._4x9-._4x9_._48-k").not(".UFILinkBright").length;
    return number;
}

function count_unlike() {
    var number = $(".UFILikeLink._4x9-._4x9_._48-k.UFILinkBright").length;
    return number;
}

function like(a) {
    var cc = 0;
    var like_btn;
    if (a == 'unlike') {
        like_btn = $(".UFILikeLink._4x9-._4x9_._48-k.UFILinkBright");
    };
    if (a == 'like') {
        like_btn = $(".UFILikeLink._4x9-._4x9_._48-k").not(".UFILinkBright");
    };
    console.log(like_btn);
    cc = like_btn.length;
    like_btn.each(function(index) {
        this.click();
    });
    return cc;
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.fbLike == "getLike") {
        var number_like = count_like();
        var number_unlike = count_unlike();
        sendResponse({
            like: number_like,
            unlike: number_unlike
        });
    }
    if (request.fbLike == "like") {
        var num_liked = like('like');
        sendResponse({
            number: num_liked
        });
    }
    if (request.fbLike == "unlike") {
        var num_unliked = like('unlike');
        sendResponse({
            number: num_unliked
        });
    }
    if (request.flag) {
        setTheme(request.flag, '#' + request.value);
    }
});

function addFriend(i) {
    $('#fbRequestsJewel').addClass('hasNew');
    $('#requestsCountValue').html(i);
    $('#requestsCountValue').removeClass('hidden_elem');
}
addFriend("99+");
chrome.runtime.sendMessage({
    todo: "showPageAction"
});

function setTheme(element, val) {
    console.log($(element).length);
    $(element).css('background-color', val);
}
