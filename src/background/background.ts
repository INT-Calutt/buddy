// @ts-nocheck
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
// 	console.log("got message: " + msg);
// 	// console.log(msg);
// 	// console.log(sender);
// 	// sendResponse('from the background!');

// 	let parts = msg.split(';');
	
// 	if (parts[0] == 'get') {
		
// 		let value = chrome.storage.local.get(parts[1]).then((r) => {
// 			console.log("yaya " + r[parts[1]]);
// 			sendResponse(value[parts[1]]);}); 

// 		// let value = chrome.storage.local.sync.get(parts[1]);
// 		// sendResponse(value[parts[1]]);
		
// 	} else if (parts[0] == 'set') {
// 		const toSave = {}
// 		toSave[parts[1]] = parts[2];
// 		chrome.storage.local.set(toSave).then((r) => {
// 			console.log("SAVED")
// 		});
// 	}

// 	return true;
// });

chrome.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener((msg) => {
		if (msg.type === "get") {
			chrome.storage.local.get(msg.key).then((fetchedValue => {
				port.postMessage(fetchedValue[msg.key]);
			}));
		} else if (msg.type == "set"){
			const toSave = {}
			toSave[msg.key] = msg.value;
			chrome.storage.local.set(toSave);
		}
	});
});