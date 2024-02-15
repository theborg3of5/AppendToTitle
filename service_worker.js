
/**
 * Whenever a tab is updated, make sure its title includes a suffix if needed.
 * https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onUpdated
 * @param {string} tabId ID of the tab that was updated.
 * @param {object} changeInfo Object of info about what changed.
 * @param {Tab} tab Tab object that was updated.
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) =>
{
	if (!tabId)
		return;

	const suffix = await getSuffixForURL(tab.url);
	if (needToUpdateTitle(changeInfo, tab, suffix))
	{
		// Inject a script that changes the tab's title.
		chrome.scripting.executeScript({
			target: { tabId },
			func: addTitleSuffix,
			args: [suffix]
		});
	}
});

/**
 * Check whether we actually need to update the tab's title with a suffix.
 * @param {object} changeInfo Object of info about what changed.
 * @param {Tab} tab Tab object that was updated.
 * @param {string} suffix Suffix that we want to be on this tab's title.
 * @returns true/false - do we need to update the title?
 */
function needToUpdateTitle(changeInfo, tab, suffix)
{
	// If there's no suffix, then there's nothing to add.
	if (!suffix)
		return false;
	
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

/**
 * Try to add the given suffix to the page title. This is injected into the page with chrome.scripting.executeScript().
 * @param {string} suffix The suffix to add to the page (tab) title.
 */
function addTitleSuffix(suffix)
{
	// Check here too, to make sure that we're not adding it twice (because race conditions).
	if (document.title.endsWith(suffix))
		return
	
	document.title = document.title + suffix;
}

/**
 * Retrieve the suffix (if any) for the given URL from settings.
 * @param {string} queryURL The URL of the tab we're processing.
 * @returns The suffix that should be added to that tab's title (if any).
 */
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

/**
 * Check whether the two domains match, ignoring "www." prefixes.
 * @param {string} domain1 First domain to compare
 * @param {string} domain2 Second domain to compare
 * @returns true/false - do they match?
 */
function doDomainsMatch(domain1, domain2) {
	// Remove the "www." from both (if it exists) to check equality.
	if(domain1.substring(0, 4) == "www.")
		domain1 = domain1.substring(4);
	if(domain2.substring(0, 4) == "www.")
		domain2 = domain2.substring(4);
	
	return (domain1 == domain2);
}


