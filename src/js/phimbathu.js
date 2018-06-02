'use strict';

const link = $('.btn-see').attr('href');
const frame = '.fab-frame';
const FIRST = 0;
const ZERO = 0;
const BTN_TWO = 2;
const BTN_THREE = 3;
const BTN_THREE_LENGTH = 10;

if (link !== undefined) {
    window.location.href = link;
}
$('#balloon_left_2').remove();
const board = $('.episodes').length;
if (board > FIRST) {
    addFAB();
    $('div.list-episode a').addClass('btn btn-primary');
}

function onLoad() {
    $('li.menu-item ul').addClass('btn btn-default');
    $('.list-episode>a').each((i, elem) => {
        const string = $(elem).html().split('-');
        const ch = string.length;
        if (ch === BTN_THREE || string.length > BTN_THREE_LENGTH) {
            $(elem).addClass('three-col');
        } else if (ch === BTN_TWO) {
            $(elem).addClass('two-col');
        }
    });
    $('.float-ads').remove();
    $('#balloon_left_1').remove();
}

onLoad();

function addFAB() {
    addButton();
    addEventMove();
    $(window).resize(() => {
        if (getMargin(frame, 'right') + $().width() > $(window).width()) {
            const marginRight = $(window).width() - $(frame).width();
            if (marginRight > FIRST) {
                $(frame).css({
                    right: `${marginRight}px`,
                });
            }
        }
        if (getMargin(frame, 'bottom') + $(frame).height() > $(window).height()) {
            const marginBottom = $(window).height() - $(frame).height();
            if (marginBottom > FIRST) {
                $(frame).css({
                    bottom: `${marginBottom}px`,
                });
            }
        }
    });
}

function rotation(total, size, margin) {
    if (margin <= ZERO) {
        margin = ZERO;
    }
    const result = total - margin - size;
    if (result < ZERO) {
        return ZERO;
    }
    return result;
}

function getMargin(element, name) {
    return parseInt($(element).css(name));
}

function addButton() {
    $(document.body).append('<div class="fab-frame"></div>');
    $(frame).css({
        right: '20px',
        bottom: '20px',
    });
    const cc = $('.current')[FIRST];
    const prev = $($(cc).prev())[FIRST];
    const next = $($(cc).next())[FIRST];
    if (prev) {
        $(frame).append('<button id="btn-prev" class="fab-button fab">⬸</button>');
    }
    if (next) {
        $(frame).append('<button id="btn-next" class="fab-button fab">⤑</button>');
    }
    $('#btn-next').click(() => {
        next.click();
    });
    $('#btn-prev').click(() => {
        prev.click();
    });
}

function addEventMove() {
    let dragging = false;
    let deltaX,
        deltaY;
    $(frame).mousedown(event => {
        const offset = $(frame).offset();
        dragging = true;
        deltaX = event.clientX - offset.left;
        deltaY = event.clientY - offset.top;
        return false;
    });
    document.onmousemove = event => {
        event = event || window.event;
        if (dragging) {
            const marginLeft = event.clientX - deltaX;
            const marginRight = rotation($(window).width(), $(frame).width(), marginLeft);
            const marginTop = event.clientY - deltaY;
            const marginBottom = rotation($(window).height(), $(frame).height(), marginTop);
            $(frame).css({
                right: `${marginRight}px`,
                bottom: `${marginBottom}px`,
            });
            return false;
        }
    };
    $(document).mouseup(event => {
        dragging = false;
        event.cancelBubble = true;
    });
}
