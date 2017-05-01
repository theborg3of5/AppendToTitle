
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
		domain = settings[i].domain;
		suffix = settings[i].suffix;
		
		addSettingsRow(domain, suffix);
	}
	
}
function addSettingsRow(domain = "", suffix = "") {
	var settingsTable = document.getElementById("settingsTable");
	if(!settingsTable)
		return;
	
	var newRow = settingsTable.insertRow(-1); // -1 - add to end of table
	newRow.id = "row" + newRow.rowIndex;
	
	createInput(newRow, newRow.rowIndex, "domain", domain);
	createInput(newRow, newRow.rowIndex, "suffix", suffix);
	createDeleteButton(newRow, newRow.rowIndex);
}

function createInput(parentRow, rowIndex, tdClass, value = "") {
	if(!parentRow)
		return;
	
	var newCell = createCell(parentRow, tdClass);
	
	var newInput = document.createElement("input");
	newInput.type = "text";
	newInput.id = tdClass + rowIndex;
	newInput.value = value;
	
	newCell.appendChild(newInput);
}
function createDeleteButton(parentRow, rowIndex) {
	if(!parentRow)
		return;
	
	var newCell = createCell(parentRow, "delete");
	
	var newButton = document.createElement("button");
	newButton.type = "button";
	newButton.id = "deleteButton" + rowIndex;
	newButton.className = "deleteButton invisibleButton";
	newButton.addEventListener(
		"click",
		function() {
			var row = this.parentElement.parentElement;
			var table = row.parentElement;
			table.deleteRow(row.rowIndex);
		}
	);
	
	var newImage = document.createElement("img");
	newImage.src = "delete16.png";
	newImage.alt = "Delete";
	newImage.title = "Remove this domain and suffix";
	newButton.appendChild(newImage);
	
	newCell.appendChild(newButton);
}
function createCell(parentRow, tdClass = "") {
	var newCell = parentRow.insertCell(-1);
	if(tdClass)
		newCell.className = tdClass;
	
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
document.querySelector("#addButton").addEventListener(
	"click", 
	function() {
		addSettingsRow();
	}
);

// // Update whether custom warning is shown when different page options are selected.
// var pinnedTabPageInputs = document.querySelectorAll(".PinnedTabPage")
// for(var i = 0; i < pinnedTabPageInputs.length; i++)
	// pinnedTabPageInputs[i].addEventListener("change", updateCustomWarningEvent);
