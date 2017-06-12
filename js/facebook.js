const MAX_LIKE = 25;
let mainContent = '#contentArea div';
let frame = '.fab-frame';

function addShortcut() {
    $(document).keydown(function(evt) {
        if (evt.keyCode === 76 && (evt.ctrlKey)) {
            //Ctrl + L
            evt.preventDefault();
            like();
            setLike();
        }
        if (evt.keyCode === 72 && (evt.ctrlKey)) {
            //Ctrl + H
            evt.preventDefault();
            hideShowFab('.fab-frame');
        }
    });
}

function hideShowFab(element) {
    let now_index = $(element).css('z-index');
    if (now_index > 200) {
        now_index = -1;
    } else {
        now_index = 399;
    }
    $(element).css('z-index', now_index);
    return now_index;
}
!function addLikeButton() {
    if ($(mainContent)[0] || $('#pagelet_timeline_main_column').length) {
        $(document.body).
            append(
                '<div class="fab-frame"><button id="fab-like" class="fab-button fab">&#10084;</button><button id = "fab-text" class="fab-text fab">0</button></div>');
        $('.fab-frame').css({
            'right': '20px',
            'bottom': '90px',
        });
        $('.fab-button').css({
            'background-color': '#f25268',
        });
        $('#fab-like').click(() => {
            like();
            setLike();
        }).hover(() => {
            setLike();
        }, function() {
            setLike();
        });
        $('#fab-text').click(() => {
            $('html, body').animate({
                scrollTop: $(document).height(),
            }, 'fast');
            setLike();
        });
        setMargin();
        $(window).resize(() => {
            setMargin();
        });
        addShortcut();
    }

}();

function setLike() {
    $('.fab-text').html(count_like());
}

function setMargin() {
    let element = $(mainContent)[0] || $('#pagelet_timeline_main_column');
    let marginRight = getMarginRight(element) - ($(frame).width() >> 1);
    if (marginRight < 0) {
        marginRight = 0;
    }
    $(frame).css({
        'right': marginRight,
    });
}

function getMarginRight(element) {
    return $(window).width() - $(element).width() - $(element).offset().left;
}

function count_like() {
    return $('.UFILikeLink._4x9-._4x9_._48-k').not('.UFILinkBright').length;
}
function like() {
    let numLike = 0;
    let like_btn = $('.UFILikeLink._4x9-._4x9_._48-k').not('.UFILinkBright');
    console.log(like_btn);
    numLike = like_btn.length;
    like_btn.each(function(index) {
        if (index > MAX_LIKE) {
            return numLike;
        }
        console.log('index : ' + index);
        this.click();
    });
    return numLike;
}

!function addFriend(i) {
    $('#fbRequestsJewel').addClass('hasNew');
    $('#requestsCountValue').html(i).removeClass('hidden_elem');
}('99+');