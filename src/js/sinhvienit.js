$('#uniad-zone-17').remove();
$('#btnSubmit1').click();
let link = $('#btn-redir').attr('title');
if(link !== undefined){
	window.location.href = link;
}
