let frame1 = '<div class="input-group form-group"><input type="text" class="form-control" value="';
let frame2 = '"><span class="remove input-group-addon btn btn-danger"><i class="glyphicon glyphicon-remove"></i></span></div>';
let defaultOptions = {
    'blockRequest': [],
    'isEnable': 1,
    'seenChat': 1,
    'typingChat': 1,
    'typingPost': 0,
    'stopTimeline': 0,
    'stopGroup': 0
};

getBlockRequest();
setClick();
addShortcut();

function addShortcut(){
	$(document).keydown(evt =>{
		if(evt.ctrlKey){
			switch(evt.keyCode){
				case 83:
					evt.preventDefault();
					$('.save').click();
					break;
			}
		}
	});
}
function getId(param){
	return $(param).attr('id');
}
function setClick(){
	$('.default-music').click(() =>{
		setRingtone(false);
	});
	$('.save-music').click(() =>{
		setRingtone(true);
	});
	$('.save').click(h);
    function h() {
        save();
    }

    $('.add').click(() =>{
		console.warn('add : ');
		add('');
	});
	$('.remove').click(function() {
		console.warn('remove : ');
		remove(this);
	});
	$('.remove-all').click(() =>{
		$('.list').empty();
		save();
	});
	$('.checkbox').click(function() {
		let now = $(this).attr('aria-valuenow');
		if(now + '' === '0'){
			now = 1;
		} else {
			now = 0;
		}
		updateStatus(this, now);
		let id = getId(this);
		setOption(id, now);
	});
	$(".import input[type=file]").change(function() {
		let reader = new FileReader();
		reader.onload = event =>{
			let result = event.target.result;
			let newList = result.split(",");
			setOption('blockRequest', newList);
			getBlockRequest();
		};
		let cc = $(this).get(0).files[0];
		reader.readAsText(cc);
	});
}
function save(){
	let blockRequest = [];
	$('.list input').each(function() {
		let urlBlock = $(this).val().replace(/^\s+|\s+$/gm, '').split(",");
		console.log(":" + urlBlock);
		if(urlBlock){
			blockRequest = blockRequest.concat(urlBlock);
		}
	});
	chrome.storage.sync.set({'blockRequest': blockRequest}, () =>{
		// Notify that we saved.
		console.info('Settings saved');
	});
	getBlockRequest();
}
function updateStatus(element, now){
	$(element).attr('aria-valuenow', now + 0);
	if(now === 0){
		$(element).children('.glyphicon').addClass('glyphicon-unchecked').removeClass('glyphicon-check');
		$(element).addClass('btn-info').removeClass('btn-success');
	} else {
		$(element).children('.glyphicon').addClass('glyphicon-check').removeClass('glyphicon-unchecked');
		$(element).removeClass('btn-info').addClass('btn-success');
	}
}
function init(data){
	updateStatus('#isEnable', data.isEnable);
	updateStatus('#seenChat', data.seenChat);
	updateStatus('#typingChat', data.typingChat);
	updateStatus('#typingPost', data.typingPost);
	updateStatus('#stopTimeline', data.stopTimeline);
	updateStatus('#stopGroup', data.stopGroup);
	setRingtoneText();
}
function getBlockRequest(){
	$('.list').empty();
	chrome.storage.sync.get(defaultOptions,
        data =>{
            init(data);
            if (data.blockRequest.length > 0) {
                data.blockRequest.forEach(element => {
                    add(element);
                    console.info(element);
                });
            } else {
                add('');
            }
            $('.export').attr("href", "data:text/plain;base64," + btoa(data.blockRequest.toString()));
        });
}
function add(element){
	if(element === ''){
		element = frame1 + '*://*.' + frame2;
		$('div.list').prepend($(element));
	} else {
		element = element.replace(/^\s+|\s+$/gm, '');
		element = frame1 + element + frame2;
		$('div.list').append($(element));
	}
	$('.remove').click(function() {
		remove(this);
	});
}
function remove(element){
	console.warn('remove : ' + element);
	$(element).parent().remove();
}
function setOption(id, now){
	console.info('id  = ' + id + ';  now = ' + now);
	let tmp = {};
	tmp[id] = now;
	id && chrome.storage.sync.set(tmp);
}
function setRingtoneText(){
	chrome.storage.sync.get(
		{'ringtone': ''},
		(data) =>{
			$('#ringtone').val(data.ringtone);
		});
}
function setRingtone(boo){
	let ringtone = boo ? $('#ringtone').val() : '';
	chrome.storage.sync.set({'ringtone': ringtone}, () =>{
		// Notify that we saved.
		console.info('Set ringtone to :' + ringtone);
	});
	setRingtoneText();
}