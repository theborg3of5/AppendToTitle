
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
	if(!changeInfo.title)
		return;
	
	var suffix = getSuffix(tab.url);
	if(!suffix)
		return;
	if(changeInfo.title.endsWith(suffix)) // Don't need to do anything if the title already has what we want on the end.
		return;
	
	var newTitle = changeInfo.title + suffix;
	chrome.tabs.executeScript(
		tabId, 
		{
			code: "document.title = '" + newTitle + "'"
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
	
	var domainFromSettings, trimmedDomain;
	for(var i = 0; i < LocalSettings.length; i++)
		if(doDomainsMatch(LocalSettings[i].domain, domain))
			return LocalSettings[i].suffix;
	
	return "";
}
function doDomainsMatch(domain1, domain2) {
	// Reduce both (taking off www. if it's there) to check equality.
	if(domain1.substring(0, 4) == "www.")
		domain1 = domain1.substring(4);
	if(domain2.substring(0, 4) == "www.")
		domain2 = domain2.substring(4);
	
	return (domain1 == domain2);
}


updateLocalSettings();


chrome.storage.onChanged.addListener(updateLocalSettings);
chrome.tabs.onUpdated.addListener(tabUpdated);
