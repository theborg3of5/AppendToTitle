
// var LocalSettings = [];

// function updateLocalSettings() {
// 	chrome.storage.sync.get(
// 		"ATT_Settings",
// 		function(items) {
// 			LocalSettings = items["ATT_Settings"];
// 		}
// 	);
// }

async function tabUpdated(tabId, changeInfo, tab)
{
	if (!tabId)
		return;
	var suffix = await getSuffixForURL(tab.url);
	if (!suffix) // If there's no suffix, nothing to do.
		return;
	
	if (needToUpdateTitle(changeInfo, tab, suffix))
	{
		// Inject a script that changes the tab's title.
		chrome.scripting.executeScript({
			target: { tabId },
			func: updateTitle,
			args: [suffix]
		});
	}
}

function needToUpdateTitle(changeInfo, tab, suffix)
{
	// Title can come either from changeInfo (when the title is changing), or from the document as a whole.
	const title = changeInfo.title ?? tab.title;
	
	// If the title is (or is changing to) something that already has the suffix we want, nothing left to do.
	// Also avoids triggering based on our own title change.
	if (title && title.endsWith(suffix))
		return false;
	
	// If we don't have a title to work with and the request still isn't complete, let it be.
	// The request completing is our last guaranteed update.
	if (!title && (changeInfo.status != "complete"))
		return false;

	return true;
}

// gdbdoc call out that this is to be injected into the tab to actually update its title
function updateTitle(suffix)
{
	// Check here too, to make sure that we're not adding it twice (because race conditions).
	if (document.title.endsWith(suffix))
		return
	
	document.title = document.title + suffix;
}
// function getSuffix(currentURL) {
// 	if(!currentURL)
// 		return "";
// 	if(!LocalSettings)
// 		return "";
	
// 	var urlObject = new URL(currentURL);
// 	var domain = urlObject.hostname;	
// 	if(!domain)
// 		return "";
	
// 	for(var i = 0; i < LocalSettings.length; i++)
// 		if(doDomainsMatch(LocalSettings[i].domain, domain))
// 			return LocalSettings[i].suffix;
	
// 	return "";
// }

async function getSuffixForURL(queryURL)
{
	// Extract domain from url
	const queryDomain = new URL(queryURL).hostname;
	if(!queryDomain)
		return "";

	// Retrieve settings and compare each row's domain to the current one
	const settings = await chrome.storage.sync.get("ATT_Settings");
	for (const row of settings["ATT_Settings"]) {
		if(doDomainsMatch(row.domain, queryDomain))
			return row.suffix;
	}
	
	return "";
}

function doDomainsMatch(domain1, domain2) {
	// Remove the "www." from both (if it exists) to check equality.
	if(domain1.substring(0, 4) == "www.")
		domain1 = domain1.substring(4);
	if(domain2.substring(0, 4) == "www.")
		domain2 = domain2.substring(4);
	
	return (domain1 == domain2);
}


// updateLocalSettings();


// chrome.storage.onChanged.addListener(updateLocalSettings);
chrome.tabs.onUpdated.addListener(tabUpdated);
