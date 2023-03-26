// @ts-nocheck

chrome.runtime.onConnect.addListener((port) => {
	port.onMessage.addListener((msg) => {
		if (msg.type === 'get') {
			chrome.storage.local.get(msg.key).then((fetchedValue) => {
				port.postMessage(fetchedValue[msg.key]);
			});
		} else if (msg.type === 'set') {
			const toSave = {};
			toSave[msg.key] = msg.value;
			chrome.storage.local.set(toSave);
		}
	});
});
