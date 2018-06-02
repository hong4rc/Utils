'use strict';

$('#uniad-zone-17').remove();
$('#btnSubmit1').click();
const link = $('#btn-redir').attr('title');
if (link !== undefined) {
    window.location.href = link;
}
