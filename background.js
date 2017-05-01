
var LocalSettings = [];


function updateLocalSettings() {
	chrome.storage.sync.get(
		ATT_Settings,
		function(items) {
			LocalSettings = items[ATT_Settings];
		}
	);
}

function tabUpdated(tabId, changeInfo, tab) {
	if(!tabId)
		return;
	if(changeInfo.status != "complete")
		return;
	
	var suffix = getSuffix(tab.url);
	if(!suffix)
		return;
	
	var newTitle = tab.title + suffix;
	
	chrome.tabs.executeScript(
		tabId, 
		{
			code: "document.title = '" + tab.title + suffix + "'"
		}
	);
}
function getSuffix(currentURL) {
	if(!currentURL)
		return "";
	if(!LocalSettings)
		return "";
	
	var urlObject = new URL(currentURL);
	var domain = urlObject.hostname;
	if(!domain)
		return "";
	
	for(var i = 0; i < LocalSettings.length; i++) {
		if(LocalSettings[i].domain == domain)
			return LocalSettings[i].suffix;
	}
	
	return "";
}


updateLocalSettings();


chrome.storage.onChanged.addListener(updateLocalSettings);
chrome.tabs.onUpdated.addListener(tabUpdated);
