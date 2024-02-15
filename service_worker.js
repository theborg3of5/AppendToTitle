
var LocalSettings = [];

function updateLocalSettings() {
	chrome.storage.sync.get(
		"ATT_Settings",
		function(items) {
			LocalSettings = items["ATT_Settings"];
		}
	);
}

function tabUpdated(tabId, changeInfo, tab)
{
	if (!tabId)
		return;
	var suffix = getSuffix(tab.url);
	if (!suffix)
		return;
	
	// Title can come either from changeInfo (when the title is changing), or from the document as a whole.
	var title = changeInfo.title;
	if (!title)
		title = tab.title;
	
	// If the title is (or is changing to) something that already has the suffix we want, nothing left to do.
	// Also avoids triggering based on our own title change.
	if (title && title.endsWith(suffix))
		return;
	
	// If we don't have a title to work with and the request still isn't complete, let it be.
	// The request completing is our last guaranteed update.
	if (!title && (changeInfo.status != "complete"))
		return;
	
	// Inject a script that changes the tab's title.
	chrome.scripting.executeScript({
		target: { tabId },
		func: updateTitle,
		args: [suffix]
	});
}

// gdbdoc call out that this is to be injected into the tab to actually update its title
function updateTitle(suffix)
{
	// Check here too, to make sure that we're not adding it twice (because race conditions).
	if (document.title.endsWith(suffix))
		return
	
	document.title = document.title + suffix;
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
