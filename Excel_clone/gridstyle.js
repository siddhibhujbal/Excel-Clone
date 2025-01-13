// Handle text color input click to trigger hidden color picker
textColorInput.addEventListener("click", function (e) {
    // Simulate click on the hidden color picker input
    textColorHInput.click();
})
textColorHInput.addEventListener("change", function (e) {
    let color = textColorHInput.value;
    let address = addressInput.value;;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector
        (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
    tobeChangedCell.style.color = color;
    // Update the color in the database
    let { rid, cid } = getRidCidFromAddress(address);
    db[rid][cid].color = color;
})
backgroundInput.addEventListener("click", function (e) {
    // Trigger the hidden background color input click
    backgroundHInput.click();
})
backgroundHInput.addEventListener("change", function (e) {
    let color = backgroundHInput.value;
    let address = addressInput.value;;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector
        (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
    tobeChangedCell.style.backgroundColor = color;
    let { rid, cid } = getRidCidFromAddress(address);
    db[rid][cid].backgroundColor = color;
})
fontSizeInput.addEventListener("change", function () {
    let fontSize = fontSizeInput.value;
    let address = addressInput.value;;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector
        (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
 // Update font size in the database and the UI
    let { rid, cid } = getRidCidFromAddress(address);
    let cellObject = db[rid][cid];
    tobeChangedCell.style.fontSize = fontSize + "px";
    cellObject.fontSize = fontSize;
})

// Update font family
fontFamilyInput.addEventListener("change", function () {
    let fontFamily = fontFamilyInput.value;
    let address = addressInput.value;;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector
        (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
     // Apply the selected font family
    tobeChangedCell.style.fontFamily = fontFamily;
})

// Toggle bold style on the selected cell
boldIcon.addEventListener("click", function () {
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    // Ui se address get 
    let tobeChangedCell = document.querySelector
        (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
    // db jaake -> value set
    let cellObject = db[ridcidObj.rid][ridcidObj.cid];
    // change fontSize property
    if (cellObject.bold) {
        tobeChangedCell.style.fontWeight = "normal";
        boldIcon.classList.remove("selected");
        cellObject.bold = false;
    } else {
        tobeChangedCell.style.fontWeight = "bold";
        boldIcon.classList.add("selected");
        cellObject.bold = true;
    }
    // icon change kar do 
})

// Toggle italic style on the selected cell
italicIcon.addEventListener("click", function () {
    // Ui se address get 
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector
        (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
    // change fontSize property
    // icon change kar do 
    let cellObject = db[ridcidObj.rid][ridcidObj.cid];
    if (cellObject.italic) {
        tobeChangedCell.style.fontStyle = "normal";
        italicIcon.classList.remove("selected");
        cellObject.italic = false;
    } else {
        tobeChangedCell.style.fontStyle = "italic";
        italicIcon.classList.add("selected");
        cellObject.italic = true;
    }
})

// Toggle underline style on the selected cell
underlineIcon.addEventListener("click", function () {
    //get address from ui
    let address = addressInput.value;
    let ridcidObj = getRidCidFromAddress(address);
    let tobeChangedCell = document.querySelector
        (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
    let cellObject = db[ridcidObj.rid][ridcidObj.cid];
    if (cellObject.underline) {
        tobeChangedCell.style.textDecoration = "none";
        underlineIcon.classList.remove("selected");
        cellObject.underline = false;
    } else {
        tobeChangedCell.style.textDecoration = "underline";
        underlineIcon.classList.add("selected");
        cellObject.underline = true;
    }
})

// Change the horizontal alignment of the selected cell
alignmentContainer.addEventListener("click", function (e) {
    if (e.target !== alignmentContainer) {
        let classesArr = e.target.classList;
        let hAlignment = classesArr[classesArr.length - 1];
        let address = addressInput.value;
        let ridcidObj = getRidCidFromAddress(address);
        let tobeChangedCell = document.querySelector
            (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
         // Apply the horizontal alignment change
        tobeChangedCell.style.textAlign = hAlignment;
        // Remove previous selection and mark the new one
        let optionElements = alignmentContainer.children;
        for (let i = 0; i < optionElements.length; i++) {
            optionElements[i].classList.remove("selected");
        }

        e.target.classList.add("selected");
         // Update the alignment in the database
        let cellObject = db[ridcidObj.rid][ridcidObj.cid];
        cellObject.halign = hAlignment;
    }
})