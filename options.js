
function loadOptions() {
	chrome.storage.sync.get(
		[
			"ATT_Settings"
		],
		function(items) {
			var settings = items["ATT_Settings"];
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
	
	createInput(newRow, "domainInput", domain);
	createInput(newRow, "suffixInput", suffix);
	createDeleteButton(newRow, newRow.rowIndex);
}
function createInput(parentRow, inputClass = "", value = "") {
	if(!parentRow)
		return;
	
	var newCell = parentRow.insertCell(-1);
	
	var newInput = document.createElement("input");
	newInput.type = "text";
	if(inputClass)
		newInput.className = inputClass;
	newInput.value = value;
	
	newCell.appendChild(newInput);
}
function createDeleteButton(parentRow, rowIndex) {
	if(!parentRow)
		return;
	
	var newCell = parentRow.insertCell(-1);
	
	var newButton = document.createElement("button");
	newButton.type = "button";
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

function saveOptions() {
	var settings = readSettingsTable();
	
	chrome.storage.sync.set(
		{
			["ATT_Settings"]: settings
		}
	);
	
	flashSaved();
}
function readSettingsTable() {
	var settings = [];
	
	// Loop over all rows in table and grab the domain / string combos.
	var table = document.getElementById("settingsTable");
	var row, domain, suffix;
	for(var i = 1; i < table.rows.length; i++) { // Start at 1 to avoid header row.
		row = table.rows[i];
		domain = row.cells[0].firstElementChild.value;
		suffix = row.cells[1].firstElementChild.value;
		settings.push(
			{
				"domain": domain,
				"suffix": suffix
			}
		);
	}
	
	return settings;
}
function flashSaved() {
	var status = document.getElementById("status");
	status.innerHTML = "Options Saved.";
	setTimeout(
		function() {
			status.innerHTML = "";
		},
		750
	);
}


// Add the events to load/save from this page.
document.addEventListener("DOMContentLoaded", loadOptions);
document.querySelector("#save").addEventListener("click", saveOptions);
document.querySelector("#addButton").addEventListener(
	"click", 
	function() {
		addSettingsRow();
	}
);
