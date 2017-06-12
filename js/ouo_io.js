let form = 'form[action]';
let link = $(form).attr('action').replace('/go/', '/rgo/');
$(form).attr('action', link);
$(form).submit();