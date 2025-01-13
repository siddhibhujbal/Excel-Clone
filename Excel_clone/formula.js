// Loop through all grid cells and add an event listener for when the user leaves the cell (blur event)
for (let i = 0; i < AllGridCells.length; i++) {
    AllGridCells[i].addEventListener("blur", function cellHelper(e) {
        let content = AllGridCells[i].textContent;
        let address = addressInput.value;
        let { rid, cid } = getRidCidFromAddress(address);
        let cellObject = db[rid][cid];
         // If the content is the same as the current value, no changes needed
        if (cellObject.value == content) {
            return;
        }
        // If the cell has a formula, remove it before updating the value
        if (cellObject.formula) {
            removeFormula(address, cellObject.formula);
            cellObject.formula = "";
        }
        // Set the new value in both the UI and the database
        setUI(content, rid, cid);
    })
}

// Formula bar event listener to set or update a formula
formulaInput.addEventListener("keydown", function (e) {
    if (e.key == "Enter" && formulaInput.value != "") {
         // Get the formula entered in the formula input field
        let cFormula = formulaInput.value;
        let addressOfTheCell = addressInput.value;
        let { rid, cid } = getRidCidFromAddress(addressOfTheCell);
        let cellObject = db[rid][cid];
         // If the formula is different from the current one, remove the old formula
        if (cellObject.formula != cFormula) {
            removeFormula(addressOfTheCell, cellObject.formula);
        }
       
        // Evaluate the formula to get the value
        let value = evaluateFormula(cFormula);
         // Set the evaluated value in the UI and database
        setUI(value, rid, cid);
        cellObject.formula = cFormula;
        // Save the new formula in the database
        setFormula(addressOfTheCell, cFormula);
    }
})

// Evaluate the formula by replacing cell references with their actual values
function evaluateFormula(formula) {
     // Split the formula into individual entities (e.g., A1, +, A2)
    let formulaEntities = formula.split(" ");
     // Loop through each part of the formula
    for (let i = 0; i < formulaEntities.length; i++) {
        let ascii = formulaEntities[i].charCodeAt(0);
        // If the entity is a cell reference (e.g., A1, B2), replace it with the cell's value
        if (ascii >= 65 && ascii <= 90) {
            let cellrcObj = getRidCidFromAddress(formulaEntities[i]);
            let value = db[cellrcObj.rid][cellrcObj.cid].value;
            formula = formula.replace(formulaEntities[i], value);
        }
    }
// Evaluate the formula string and return the result
    let result = eval(formula);
    return result;
}

// Update the UI with the new value for a cell and recursively update its dependent children
function setUI(value, rid, cid) {
    let tobeChangedCell = document.querySelector(`.grid .cell[rId='${rid}'][cId='${cid}']`);
    tobeChangedCell.textContent = value;
    db[rid][cid].value = value;
   // Update dependent cells (children) by re-evaluating their formulas
    let childrenArr = db[rid][cid].children;
    for (let i = 0; i < childrenArr.length; i++) {
        let chriciobj = getRidCidFromAddress(childrenArr[i]);
        let chCellObj = db[chriciobj.rid][chriciobj.cid];
        let value = evaluateFormula(chCellObj.formula);
        setUI(value, chriciobj.rid, chriciobj.cid)
    }
}
// Set the formula for a cell and mark it as a dependent (child) of other cells
function setFormula(address, formula) {
    let formulaEntities = formula.split(" ");
    for (let i = 0; i < formulaEntities.length; i++) {
        let ascii = formulaEntities[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            // address -> rid cId
            let parentrcObj = getRidCidFromAddress(formulaEntities[i]);
            // db -> value
            let children = db[parentrcObj.rid][parentrcObj.cid].children;
            children.push(address);
           // replace in formula (no action needed here for now)

        }
    }
}

// To set a cell as a child of a cell which depends on it
function removeFormula(address, formula) {
    let formulaEntities = formula.split(" ");
    for (let i = 0; i < formulaEntities.length; i++) {
        let ascii = formulaEntities[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 90) {
            let parentrcObj = getRidCidFromAddress(formulaEntities[i]);
            let children = db[parentrcObj.rid][parentrcObj.cid].children;
            let idx = children.indexOf(address);
            children.splice(idx, 1);
            // replace in formula (no action needed here for now)
        }
    }
}
