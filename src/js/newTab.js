'use strict';

const DAY_OF_WEEK = 7;
const PAD_START_LENGTH = 2;
const DEC_POSITION = 0;
const UNIT_POSITION = 1;
const MIL = 1000;
const CLASS = 'class';
const DAY_VEC = 1;

$(() => {

    // Cache some selectors

    const clock = $('#clock');

    // Map digits to their names (this will be an array)
    const DIGIT_TO_NAME = 'zero one two three four five six seven eight nine'.split(' ');

    // This object will hold the digit elements
    const digits = {};

    // Positions for the hours, minutes, and seconds
    const positions = [
        'h1', 'h2', ':', 'm1', 'm2', ':', 's1', 's2'
    ];

    // Generate the digits with the needed markup,
    // and add them to the clock

    const digitHolder = clock.find('.digits');

    $.each(positions, (index, elem) => {
        if (elem === ':') {
            digitHolder.append('<div class="dots">');
        } else {

            const pos = $('<div>');

            for (let i = 1; i <= DAY_OF_WEEK; i++) {
                pos.append(`<span class="d${i}">`);
            }

            // Set the digits as key:value pairs in the digits object
            digits[elem] = pos;

            // Add the digit elements to the page
            digitHolder.append(pos);
        }

    });

    // Add the weekday names

    const weekdayNames = 'MON TUE WED THU FRI SAT SUN'.split(' '),
        weekdayHolder = clock.find('.weekdays');

    $.each(weekdayNames, (index, elem) => {
        weekdayHolder.append(`<span>${elem}</span>`);
    });

    const weekDays = weekdayHolder.find('span');

    // Run a timer every second and update the clock

    const updateTime = () => {
        const now = new Date();
        const hour = String(now.getHours()).padStart(PAD_START_LENGTH, '0');
        const min = String(now.getMinutes()).padStart(PAD_START_LENGTH, '0');
        const sec = String(now.getSeconds()).padStart(PAD_START_LENGTH, '0');

        digits.h1.attr(CLASS, DIGIT_TO_NAME[hour[DEC_POSITION]]);
        digits.h2.attr(CLASS, DIGIT_TO_NAME[hour[UNIT_POSITION]]);
        digits.m1.attr(CLASS, DIGIT_TO_NAME[min[DEC_POSITION]]);
        digits.m2.attr(CLASS, DIGIT_TO_NAME[min[UNIT_POSITION]]);
        digits.s1.attr(CLASS, DIGIT_TO_NAME[sec[DEC_POSITION]]);
        digits.s2.attr(CLASS, DIGIT_TO_NAME[sec[UNIT_POSITION]]);

        const day = (now.getDay() + DAY_OF_WEEK - DAY_VEC) % DAY_OF_WEEK;

        // Mark the active day of the week
        weekDays.removeClass('active').eq(day).addClass('active');

        // Schedule this function to be run again in 1 sec
        setTimeout(updateTime, MIL);

    };
    updateTime();

    // Switch the theme

    $('a.button').click(() => {
        clock.toggleClass('light dark');
    });

});
