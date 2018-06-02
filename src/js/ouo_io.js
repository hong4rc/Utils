'use strict';

const form = 'form[action]';
const link = $(form).attr('action').replace('/go/', '/rgo/');
$(form).attr('action', link);
$(form).submit();
