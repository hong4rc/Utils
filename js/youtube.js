var iframeYoutube = '<iframe id="quickview" width="854" height="480" src="" frameborder="0" allowfullscreen></iframe>';
var regExHref = /https:\/\/www.youtube.com\/watch\?v=/;
var qsOptions = '?autoplay=true&showinfo=0';

!function enableDarkmode() {
    var cookie = document.cookie;
    var check = cookie.indexOf('VISITOR_INFO1_LIVE=fPQ4jCL6EiE');
    if (check == -1) {
        document.cookie = 'VISITOR_INFO1_LIVE=fPQ4jCL6EiE';
        location.reload();
    }
}();
function showVideo(src) {
    if (document.getElementById('quickview').src != src) {
        document.getElementById('quickview').src = src;
        $('#quickview').css('visibility', 'visible');
    }
}
function hiddenVideo(srcOptions) {
    if (document.getElementById('quickview').src != srcOptions) {
        document.getElementById('quickview').src = srcOptions;
        $('#quickview').css('visibility', 'hidden');
    }
}
$(document).ready(() => {
    $(document.body).append(iframeYoutube);
    document.getElementById('quickview').onload = function() {
        $('iframe#quickview  a.ytp-title-link yt-uix-sessionlink').html('a');
    };
    $(document).bind("contextmenu",function(event){
        var target = event.target;
        if ($(target).is('h3 a#video-title')){
            target.href;
            if (regExHref.test(target.href)){
                var idVideo = target.href.substr(-11);
                var src = 'https://www.youtube.com/embed/' + idVideo;
                showVideo(src + qsOptions);
                return false;
            }
        }

    });
});