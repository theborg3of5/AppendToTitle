
/** Page load - load settings from sync storage and populate the fields with them. */
document.addEventListener("DOMContentLoaded", async () => {
	const rows = (await chrome.storage.sync.get("ATT_Settings"))["ATT_Settings"];
	
	// Loop over all settings and build a row for each domain / string combo.
	for (const row of rows) {
		addSettingsRow(row.domain, row.suffix);
	}
});

/** Save button click - read values from fields and save them to sync storage. */
document.querySelector("#save").addEventListener("click", () => {
	// Loop over all rows in table and grab the domain / string combos.
	const settings = [];
	const table = document.getElementById("settingsTable");
	for (const row of table.rows) {
		// Skip the header row.
		if (row.rowIndex == 0)
			continue;

		settings.push({
			"domain": row.cells[0].firstElementChild.value,
			"suffix": row.cells[1].firstElementChild.value
		});
	}

	// Save settings to sync storage.
	chrome.storage.sync.set({ ["ATT_Settings"]: settings });
	
	// Flash an indicator to let the user know we saved.
	const status = document.getElementById("divStatus");
	status.innerHTML = "Options Saved.";
	setTimeout(() => { status.innerHTML = ""; }, 750);
});

/** 
 * Add button click - add a new row. 
 * We wrap addSettingsRow() so we don't pass it the click event args.
*/
document.querySelector("#addButton").addEventListener("click", () => addSettingsRow() );

/**
 * Add a row to the settings table.
 * @param {string} domain The domain value
 * @param {string} suffix The suffix to add for this domain
 */
function addSettingsRow(domain = "", suffix = "") {
	const settingsTable = document.getElementById("settingsTable");
	if(!settingsTable)
		return;
	
	const newRow = settingsTable.insertRow(-1); // -1 - end of table
	addRowInput(newRow, domain);
	addRowInput(newRow, suffix);
	addRowDeleteButton(newRow);
}

/**
 * Add an input field cell to the given row.
 * @param {tr object} parentRow Row to add an input cell to.
 * @param {string} value Value that the field should contain.
 */
function addRowInput(parentRow, value = "") {
	if(!parentRow)
		return;
	
	const newInput = document.createElement("input");
	newInput.type = "text";
	newInput.value = value;
	
	const newCell = parentRow.insertCell(-1); // -1 - end of row
	newCell.appendChild(newInput);
}

/**
 * Add a delete button cell to the given row.
 * @param {tr object} parentRow Row to add a delete button cell to.
 */
function addRowDeleteButton(parentRow) {
	if(!parentRow)
		return;
	
	const newButton = document.createElement("button");
	newButton.type = "button";
	newButton.className = "deleteButton invisibleButton";
	newButton.addEventListener("click", function () { // Use function instead of () => {} so I can use 'this' to get the button
		const row = this.parentElement.parentElement; // 'this' is the button, so its parent/grandparent are td > tr.
		const table = row.parentElement;
		table.deleteRow(row.rowIndex);
	});
	
	const newImage = document.createElement("img");
	newImage.src = "delete16.png";
	newImage.alt = "Delete";
	newImage.title = "Remove this row";
	newButton.appendChild(newImage);
	
	const newCell = parentRow.insertCell(-1); // -1 - end of row
	newCell.appendChild(newButton);
}
