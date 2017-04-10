count_like();
$(document).ready(function() {
    tab();
    $("#like-btn").click(like);
    $("#unlike-btn").click(unlike);
    $(".color-background").on('change paste keyup', function() {
        save($(this).attr('flag'), $(this).val());
    });

    resetColor();
});

function resetColor() {
    $('.reset-color').click(function(event) {
        var prev = $(this).prev();
        $(prev).val($(this).val());
        $(prev).trigger('change');
        save($(prev).attr('flag'), $(prev).val());
    });
}

function save(flag, value) {
    chrome.storage.sync.set({
        flag: value
    });
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "flag": flag,
            "value": value
        }, function(response) {});
    });
}

function tab() {
    jQuery('.tabs .tab-links button').on('click', function(e) {
        var currentAttrValue = jQuery(this).attr('flag');
        // Show/Hide Tabs
        // jQuery('.tabs ' + currentAttrValue).show().siblings().hide();
        jQuery('.tabs ' + currentAttrValue).slideDown(400).siblings().slideUp(400);
        // Change/remove current tab to active
        jQuery(this).addClass('active').siblings().removeClass('active');
        e.preventDefault();
    });
}

function count_like() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            fbLike: "getLike"
        }, function(response) {
            $("#number_like").html(response.like);
            $("#number_unlike").html(response.unlike);
        });
    });
}

function like() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            fbLike: "like"
        }, function(response) {
            $("#like-btn span").html("Đã like tất cả " + response.number + "  mục");
            $("#like-btn").fadeOut(2000);
            setTimeout(function() {
                $("#like-btn span").html("Like All");
            }, 2000);
            $("#like-btn").fadeIn(100);
            count_like();
        });
    });
}

function unlike() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            fbLike: "unlike"
        }, function(response) {
            $("#unlike-btn span").html("Đã unlike tất cả " + response.number + "  mục");
            $("#unlike-btn").fadeOut(2000);
            setTimeout(function() {
                $("#unlike-btn span").html("UnLike All");
            }, 2000);
            $("#unlike-btn").fadeIn(100);
            count_like();
        });
    });
}
