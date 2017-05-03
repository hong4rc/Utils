addFriend("99+");
addLikeButton();
chrome.runtime.sendMessage({
    todo: "showPageAction"
});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.fbLike == "getLike") {
        var number_like = count_like();
        var number_unlike = count_unlike();
        sendResponse({
            like: number_like,
            unlike: number_unlike
        });
    }
    if(request.fbLike == "like") {
        var num_liked = like('like');
        sendResponse({
            number: num_liked
        });
    }
    if(request.fbLike == "unlike") {
        var num_unliked = like('unlike');
        sendResponse({
            number: num_unliked
        });
    }
    if(request.flag) {
        setTheme(request.flag, '#' + request.value);
    }
});

function addLikeButton() {
    $(document.body).append('<div class="fab-frame"><button id="fab-like" class="fab-button fab">&#10084;</button><button id = "fab-text" class="fab-text fab">0</button></div>');
    $(".fab-frame").css({
        "right": "20px",
        "bottom": "90px"
    });
    $('.fab-button').css({
        "background-color": "#f25268"
    });
    $('#fab-like').click(function(event) {
        like('like');
        setLike();
    });
    $('#fab-text').click(function(event) {
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
    });
    $('#fab-like').hover(function() {
        setLike();
    }, function() {
        setLike();
    });
    setMargin();
    $(window).resize(function(event) {
        setMargin();
    });
}

function setLike() {
    $('.fab-text').html(count_like());
}

function setMargin() {
    var element = $('#contentArea div')[0];
    var marginRight = getMarginRight(element) - $('.fab-frame').width() / 2;
    if(marginRight < 0) {
        marginRight = 0;
    }
    $(".fab-frame").css({
        "right": marginRight
    });
}

function getMarginRight(element) {
    return $(window).width() - $(element).width() - $(element).offset().left;
}

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
    if(a == 'unlike') {
        like_btn = $(".UFILikeLink._4x9-._4x9_._48-k.UFILinkBright");
    };
    if(a == 'like') {
        like_btn = $(".UFILikeLink._4x9-._4x9_._48-k").not(".UFILinkBright");
    };
    console.log(like_btn);
    cc = like_btn.length;
    like_btn.each(function(index) {
        this.click();
    });
    return cc;
}

function addFriend(i) {
    $('#fbRequestsJewel').addClass('hasNew');
    $('#requestsCountValue').html(i);
    $('#requestsCountValue').removeClass('hidden_elem');
}

function setTheme(element, val) {
    console.log($(element).length);
    $(element).css('background-color', val);
}