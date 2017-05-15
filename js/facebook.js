const MAX_LIKE = 25;
addFriend("99+");
addLikeButton();
addShortcut();

chrome.runtime.sendMessage({
    todo: "showPageAction"
});

function addShortcut() {
    $(document).keydown(function(evt){
        if (evt.keyCode==76 && (evt.ctrlKey)){//Ctrl + L
            evt.preventDefault();
            like();
            setLike();
        }
        if (evt.keyCode==72 && (evt.ctrlKey)){//Ctrl + H
            evt.preventDefault();
            hideShowFab();
        }
    });
}
function hideShowFab() {
    var now_index = $('.fab-frame').css('z-index');
    if (now_index > 200){
        now_index = -1;
    } else {
        now_index = 399;
    }
    $('.fab-frame').css('z-index', now_index);
    return now_index;
}
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
        like();
        setLike();
    });
    $('#fab-text').click(function(event) {
        $("html, body").animate({ scrollTop: $(document).height() }, "fast");
        setLike();
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
function like(a) {
    var numLike = 0;
    var like_btn = $(".UFILikeLink._4x9-._4x9_._48-k").not(".UFILinkBright");
    console.log(like_btn);
    numLike = like_btn.length;
    like_btn.each(function(index) {
        if (index > MAX_LIKE){
            return numLike;
        }
        console.log("index : " + index);
        this.click();
    });
    return numLike;
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