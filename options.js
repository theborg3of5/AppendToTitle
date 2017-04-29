
function loadOptions() {
	chrome.storage.sync.get(
		[
			ATT_Settings
		],
		function(items) {
			var settings = items[ATT_Settings];
			buildSettingsTable(settings);
		}
	);
}
function buildSettingsTable(settings) {
	var domain, stringToAppend;
	
	// Loop over all settings and build a row for each domain / string combo.
	for(var i = 0; i < settings.length; i++) {
		domain         = settings[i].domain;
		stringToAppend = settings[i].stringToAppend;
		
		// alert("Domain: " + domain + "\nAppend: " + stringToAppend);
		addSettingsRow(domain, stringToAppend);
	}
	
}
function addSettingsRow(domain = "", stringToAppend = "") {
	
}

function saveOptions() {
	var settings = readSettingsTable();
	
	chrome.storage.sync.set(
		{
			[ATT_Settings]: settings
		}
	);
	
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(
		function() {
			status.innerHTML = "";
		},
		750
	);
}
function readSettingsTable() {
	var settings = [];
	
	settings.push(
		{
			domain:         "stackoverflow.com",
			stringToAppend: " - Website!"
		}
	);
	
	// Loop over all rows in table and grab the domain / string combos.
	// For ... in ...
		// domain = getSettingsRowDomain(row);
		// stringToAppend = getSettingsRowString(row);
		// if(!domain || !stringToAppend)
				// Break (or Continue, or whatever)
		// settings[domain] = stringToAppend;
	
	return settings;
}



// function updateCustomWarningEvent(e) {
	// updateCustomWarning(e.target.value);
// }
// function updateCustomWarning(pinnedTabPage) {
	// if(pinnedTabPage == PinnedTabPage_Custom)
		// document.getElementById("customWarning").style.display = "inline";
	// else
		// document.getElementById("customWarning").style.display = "none";
// }


// Add the events to load/save from this page.
document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("#save").addEventListener("click", saveOptions);

// // Update whether custom warning is shown when different page options are selected.
// var pinnedTabPageInputs = document.querySelectorAll(".PinnedTabPage")
// for(var i = 0; i < pinnedTabPageInputs.length; i++)
	// pinnedTabPageInputs[i].addEventListener("change", updateCustomWarningEvent);
