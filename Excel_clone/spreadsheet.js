// Select essential UI elements
let topRow = document.querySelector(".top_row");
let leftCol = document.querySelector(".left_col");

// grid
let grid = document.querySelector(".grid");
let addressInput = document.querySelector(".address_input");
let formulaInput = document.querySelector(".formula_input");

// menu elements for formatting and styling
let fontSizeInput = document.querySelector(".font_size_input");
let fontFamilyInput = document.querySelector(".font_family_input");
let boldIcon = document.querySelector(".fa-bold");
let underlineIcon = document.querySelector(".fa-underline");
let italicIcon = document.querySelector(".fa-italic");
let alignmentContainer = document.querySelector(".alignment_container");
let textColorHInput = document.querySelector(".text_color");
let textColorInput = document.querySelector(".fa-tint");
let backgroundHInput = document.querySelector(".background_color");
let backgroundInput = document.querySelector(".fa-fill-drip");
let createSheetIcon = document.querySelector(".fa-plus");
let sheetList = document.querySelector(".sheets-list");
let firstSheet = document.querySelector(".sheet");

// Create top row labels (A-Z) for columns
for (let i = 0; i < 26; i++) {
    let div = document.createElement("div");
    div.setAttribute("class", "cell");
    div.textContent = String.fromCharCode(65 + i);
    topRow.appendChild(div)
}

// Create left column labels (1-100) for rows
for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div");
    div.setAttribute("class", "cell");
    div.textContent = i;
    leftCol.appendChild(div)
}

// Create the grid (100 rows x 26 columns)
for (let i = 0; i < 100; i++) {
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    for (let j = 0; j < 26; j++) {
        let div = document.createElement("div");
        div.setAttribute("class", "cell");
       
        div.setAttribute("contentEditable", "true") // Make cells editable
        div.setAttribute("rId", i);  // Row ID
        div.setAttribute("cId", j); // Column ID
        row.appendChild(div);
    }
    grid.appendChild(row)
}

// Initialize the database with default cell values
let sheetsDb = [];
function initDB() {
    let db = [];
    for (let i = 0; i < 100; i++) {
        let rowArr = [];
        for (let j = 0; j < 26; j++) {
            let cellObject = {
                color: "black",
                backgroundColor: "white",
                fontFamily: "'Courier New'",
                fontSize: 14,
                halign: "center",
                italic: false,
                underline: false,
                bold: false,
                value: "",
                formula: "",
                children: []
            }
            rowArr.push(cellObject)
        }
        db.push(rowArr);
    }
    sheetsDb.push(db);
}

initDB();
let db = sheetsDb[0];
// Click event listener for selecting a cell
let AllGridCells = document.querySelectorAll(".grid .cell");
for (let i = 0; i < AllGridCells.length; i++) {
    AllGridCells[i].addEventListener("click", function (e) {
        // // previous cell address
        let prevAddress = addressInput.value;
        if (prevAddress != "") {
            let ridcidObj = getRidCidFromAddress(prevAddress);
            // If there's a previously selected cell, remove its border
            let prevCell = document
                .querySelector
                (`.grid .cell[rId='${ridcidObj.rid}'][cId='${ridcidObj.cid}']`);
            prevCell.style.border = "0.1px solid gray";
            prevCell.style.borderRight = "none";
            prevCell.style.borderTop = "none";
        }
         // Get the address of the clicked cell
        let rid = AllGridCells[i].getAttribute("rId");
        let cid = AllGridCells[i].getAttribute("cId");
        //    get -> always in string 
        rid = Number(rid);
        cid = Number(cid);
        addressInput.value = String.fromCharCode(cid + 65) + (rid + 1);
       // Highlight the clicked cell with a blue border
        let cCell = AllGridCells[i];
        cCell.style.border = "2px solid #1B9CFC";

        // *****************2 way binding menu styling*****************
         // Two-way binding: Update the menu options based on the selected cell's properties
        let cellObject = db[rid][cid];
        // font size 
        let fontSize = cellObject.fontSize;
        fontSizeInput.value = fontSize;
        boldIcon.classList.remove("selected");
        italicIcon.classList.remove("selected");
        underlineIcon.classList.remove("selected");
        let optionElements = alignmentContainer.children;
        for (let i = 0; i < optionElements.length; i++) {
            optionElements[i].classList.remove("selected");
        }
         
        // Update the menu icons based on cell's formatting (bold, italic, underline)
          if (cellObject.bold) {
            boldIcon.classList.add("selected");
        }
        if (cellObject.italic) {
            italicIcon.classList.add("selected");
        }
        if (cellObject.underline) {
            underlineIcon.classList.add("selected");
        }
        if (cellObject.halign) {
            for (let i = 0; i < optionElements.length; i++) {
                let elementClasses = optionElements[i].classList;
                let hAlignment = elementClasses[elementClasses.length - 1];
                if (hAlignment == cellObject.halign) {
                    elementClasses.add("selected");
                }
            }
        }
        formulaInput.value = cellObject.formula

    })
}

// Initialize the first cell as selected
let firstCell = document.querySelector(".grid .cell[rId='0'][cId='0']");
firstCell.click();
firstCell.focus();

// Helper function to convert cell address (e.g., A1) to row and column IDs
function getRidCidFromAddress(address) {

    let AsciiValue = address.charCodeAt(0);
    let cid = AsciiValue - 65;
    let rid = Number(address.substring(1)) - 1;
    return {
        rid: rid, cid: cid
    }

}

// Handle sheet switching when first sheet is clicked
firstSheet.addEventListener("click", function (e) {
    //    list of sheet me se sabme se aap remove active sheet
    for (let i = 0; i < sheetList.children.length; i++) {
        sheetList.children[i].classList.remove("active-sheet")
    }
    // given sheet add kar lo 
    firstSheet.classList.add("active-sheet");
    db = sheetsDb[0];
    setinitUI();

})

// Handle new sheet creation
createSheetIcon.addEventListener("click", sheetHandler);
function sheetHandler() {
    let noofChildren = sheetList.children.length;
    // dom se create 
    let newSheet = document.createElement("div");
    newSheet.setAttribute("class", "sheet");
    newSheet.setAttribute("sheetIdx", noofChildren);
    newSheet.textContent = `Sheet ${noofChildren + 1}`
    sheetList.appendChild(newSheet);
    initDB();
    // active me switch
    newSheet.addEventListener("click", function () {
        for (let i = 0; i < sheetList.children.length; i++) {
            sheetList.children[i].classList.remove("active-sheet")
        }
        newSheet.classList.add("active-sheet");
        let idx = newSheet.getAttribute("sheetIdx");
        db = sheetsDb[idx];
        setinitUI();

    })
    newSheet.click();// Automatically select the new sheet
}

function sheetOpenHandler() {
    let noofChildren = sheetList.children.length;
    // dom se create 
    let newSheet = document.createElement("div");
    newSheet.setAttribute("class", "sheet");
    newSheet.setAttribute("sheetIdx", noofChildren);
    newSheet.textContent = `Sheet ${noofChildren + 1}`
    sheetList.appendChild(newSheet);
    initDB();
    // active me switch
    newSheet.addEventListener("click", function () {
        for (let i = 0; i < sheetList.children.length; i++) {
            sheetList.children[i].classList.remove("active-sheet")
        }
        newSheet.classList.add("active-sheet");
        let idx = newSheet.getAttribute("sheetIdx");
        db = sheetsDb[idx];
        setinitUI();
    })
}

// Initialize UI with the current database values
function setinitUI() {
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 26; j++) {
            //    set all the properties on ui with matching rid,cid
            let cellObject = db[i][j];
            let tobeChangedCell = document.querySelector(`.grid .cell[rId='${i}'][cId='${j}']`);
            tobeChangedCell.innerText = cellObject.value;
            tobeChangedCell.style.color = cellObject.color;
            tobeChangedCell.style.backgroundColor = cellObject.backgroundColor;
            tobeChangedCell.style.fontFamily = cellObject.fontFamily;
            tobeChangedCell.style.textAlign = cellObject.halign;
            tobeChangedCell.style.textDecoration = cellObject.underline == false ? "none" : "underline";
            tobeChangedCell.style.fontStyle = cellObject.italic == false ? "normal" : "italic";
            tobeChangedCell.style.fontSize = cellObject.fontSize;
        }
    }
}