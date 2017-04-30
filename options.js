
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
	var domain, suffix;
	
	// Loop over all settings and build a row for each domain / string combo.
	for(var i = 0; i < settings.length; i++) {
		domain         = settings[i].domain;
		suffix = settings[i].suffix;
		
		// alert("Domain: " + domain + "\nAppend: " + suffix);
		addSettingsRow(domain, suffix);
	}
	
}
function addSettingsRow(domain = "", suffix = "") {
	
	var settingsTable = document.getElementById("settingsTable");
	if(!settingsTable)
		return;
	
	var newRow = settingsTable.insertRow(-1); // -1 - add to end of table
	newRow.id = "row" + newRow.rowIndex;
	
	createInputCell( newRow, "domain", "domainInput"     + newRow.rowIndex);
	createInputCell( newRow, "suffix", "suffixInput"     + newRow.rowIndex);
	createButtonCell(newRow, "delete", "invisibleButton" + newRow.rowIndex); // Also need onClick, image?
	
	<tr id='row1'>
		<td class='domainInput'>
			<input type='text' id='domainInput1' />
		</td>
		<td class='suffixInput'>
			<input type='text' id='suffixInput1' />
		</td>
		<td>
			<button type='button' class='invisibleButton' onclick='deleteSettingsRow(1);'>
				<img src='delete.png' alt='Delete' title='Remove this domain and suffix' />
			</button>
		</td>
	</tr>
}

function createInputCell(parentRow, tdClass = "", inputId = "") {
	if(!parentRow)
		return;
	
	var newCell = createCell(tdClass);
	
	var newInput = document.createElement("input");
	newInput.type = "text";
	if(inputId)
		newInput.id = inputId;
	
	// Add newInput to newCell
}
function createButtonCell(parentRow, tdClass = "", buttonId = "") {
	if(!parentRow)
		return;
	
	var newCell = createCell(tdClass);
	
	var newInput = document.createElement("input");
	newInput.type = "text";
	if(inputId)
		newInput.id = inputId;
	
	// Add newInput to newCell
}
function createCell(parentRow, tdClass = "") {
	var newCell = parentRow.insertCell(0);
	if(tdClass)
		newCell.class = tdClass;
	
	return newCell;
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
			domain: "stackoverflow.com",
			suffix: " - Website!"
		}
	);
	
	// Loop over all rows in table and grab the domain / string combos.
	// For ... in ...
		// domain = getSettingsRowDomain(row);
		// suffix = getSettingsRowString(row);
		// if(!domain || !suffix)
				// Break (or Continue, or whatever)
		// settings[domain] = suffix;
	
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
