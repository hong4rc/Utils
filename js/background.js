const fbRingtone = ['*://*.facebook.com/rsrc.php/yh/r/taJw7SpZVz2.mp3', '*://*.facebook.com/rsrc.php/yO/r/kTasEyE42gs.ogg'];
!function createMenuIteam(){
	var menuItem = {
		id: "anhhong",
		title: "Translate with vdict",
		contexts: ["selection"]
	};
	chrome.contextMenus.create(menuItem);
	chrome.contextMenus.onClicked.addListener(function(data){
		if(data.menuItemId === "anhhong" && data.selectionText){
			var link = 'https://vdict.com/';
			var dt = encodeURI(data.selectionText);
			link += dt + ',1,0,0.html';
			var createData = {
				url: link,
				type: "popup",
				top: 100,
				left: 100,
				width: 900,
				height: 500
			};
			chrome.windows.create(createData, function(){
			});
		}
	});
}();
!function initIsEnable(){
	chrome.storage.sync.get({
		'isEnable': 1
	}, function(data){
		if(data.isEnable == 1){
			startBlock();
		}
	});
}();
!function initFB(){
	chrome.storage.sync.get({
		'seenChat': 1,
		'typingChat': 1,
		'typingPost': 0,
		'stopTimeline': 0,
		'stopGroup': 0,
		'ringtone': 'http://r1.hot.c68.vdc.nixcdn.com/a21b608ab6f114d5e90d87f89a3d9c4d/592f633a/NhacCuaTui935/ShapeOfYouEdSheeranCover-JFla-4752376.mp3'
	}, function(data){
		chrome.storage.sync.set({
			'seenChat': data.seenChat,
			'stopTimeline': data.stopTimeline,
			'typingChat': data.typingChat,
			'typingPost': data.typingPost,
			'stopGroup': data.stopGroup,
			'ringtone': data.ringtone
		}, function(){
			console.log('Init settings Facebook successfull !!!');
		});
		checkFacebook();
		checkringtone(data.ringtone);
	});
}();
var ringtone = {
	block: function(){
	},
	remove: function(){
	}
};
function checkringtone(valueURL){

	console.log('ringtone : ' + valueURL);
	ringtone.remove();
	if(valueURL){
		ringtone.block = function(){
			return {redirectUrl: valueURL}
		};
		ringtone.remove = function(){
			chrome.webRequest.onBeforeRequest.removeListener(ringtone.block);
		};

		chrome.webRequest.onBeforeRequest.addListener(ringtone.block, {
			urls: fbRingtone
		}, ["blocking", "requestBody"]);
	}
}
chrome.storage.onChanged.addListener(function(change){
	chrome.storage.sync.get({
		'isEnable': 1
	}, function(data){
		if(change.isEnable){
			if(data.isEnable == 1){
				startBlock();
			} else {
				console.log('Stoping Block');
				stopBlock();
			}
		} else if(data.isEnable == 1 && change.blockRequest){
			startBlock();
		}
	});
	if(change.seenChat || change.typingChat || change.typingPost || change.stopTimeline || change.stopGroup){
		checkFacebook();
	}
	if(change.ringtone){
		checkringtone(change.ringtone.newValue);
	}
});

function stopBlock(){
	chrome.webRequest.onBeforeRequest.removeListener(blockedRequest);
}

function stopBlockFB(){
	console.info('stopFb');
	chrome.webRequest.onBeforeRequest.removeListener(blockedFb);
}

function blockedRequest(detail){
	console.info(getTime() + ' |Blocked :  ' + detail.url);
	return {
		cancel: true
	};
}

function getTime(){
	var currentdate = new Date();
	var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
	return datetime;
}
function floorTime(time){
	time = Math.abs(time);
	var tenth = Math.floor(time / 10);
	if(tenth == 0){
		time = '0' + time;
	} else if(tenth >= 6){
		time = 59;
	}
	return time;
}

function startBlock(){
	stopBlock();
	console.log('Starting Block');
	chrome.storage.sync.get('blockRequest', function(data){
		data.blockRequest && data.blockRequest.length > 0 &&
		chrome.webRequest.onBeforeRequest.addListener(blockedRequest, {
			urls: data.blockRequest
		}, ["blocking"]);
		for(p in data.blockRequest){
			console.warn('  |----Block patterns : ' + data.blockRequest[p]);
		}
		console.log('\n   -------- Anh Hồng --------\n');
	});
}

function checkFacebook(){
	stopBlockFB();
	console.log('Starting checkFacebook');
	var blockRequestFb = [];
	var keyFb = [
		'seenChat',
		'typingChat',
		'typingPost',
		'stopTimeline',
		'stopGroup'
	];
	var valueFb = [
		'*://*/ajax/mercury/change_read_status.php*',
		'*://*.facebook.com/ajax/messaging/typ.php?dpr*',
		'*://*.facebook.com/ufi/typing/*',
		'*://*.facebook.com/ajax/pagelet/generic.php/LitestandTailLoadPagelet*',
		'*://*.facebook.com/ajax/pagelet/generic.php/GroupEntstreamPagelet*'
	];
	chrome.storage.sync.get(keyFb, function(data){
		for(index in keyFb){
			(data[keyFb[index]] == 1) && blockRequestFb.push(valueFb[index]);
		}
		console.log(blockRequestFb);
		blockRequestFb.length && chrome.webRequest.onBeforeRequest.addListener(blockedFb, {
			urls: blockRequestFb
		}, ["blocking"]);
	});
}

function blockedFb(detail){
	console.info(getTime() + ' |Blockedfb :  ' + detail.url);
	return {
		cancel: true
	};
}
!function blockLinkneverDie(){
	var listLinkNewverdie = [
		"*://*.google-analytics.com/analytics.js",
		"*://*.popclck.net/*",
		"*://*.scorecardresearch.com/*",
		"*://adsire.com/*"
	]
	chrome.webRequest.onBeforeRequest.addListener(logLinkneverdie, {
		urls: listLinkNewverdie
	}, ["blocking"]);
}();

function logLinkneverdie(detail){
	console.info(getTime() + ' |BlockedDie :  ' + detail.url);
	return {
		cancel: true
	};
}
