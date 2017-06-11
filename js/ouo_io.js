let link = $('form[action]').attr('action').replace('/go/', '/rgo/');
$('form[action]').attr('action', link);
$('form[action]').submit();