import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
console.log("loaded");
const projectionId = 2; //needs to be changed so it grabs id from previous page
const apiUrl = "http://54.227.55.197/api/ticket/projection/" + projectionId;
let rows = 0;
let columns = 0;
const table = document.querySelector("table");
const submitBtn = document.querySelector(".submit-btn");
const h2ProjectionInfo = document.querySelector("h2");

renderNavBar();
renderFooter();
renderSeatsAndInfo();

submitBtn.addEventListener("click", () => {
  selectedSeats = readTable();
  sendRequestToBook(projectionId, selectedSeats);
});

function getProjectionInfo(responseObject) {
  //returns object with projction info
  const firstTicket = responseObject[0];
  const cinemaHallName = firstTicket.projection.cinemaHallName;
  const movieName = firstTicket.projection.movie.name;
  const projectionInfo = {
    movie: movieName,
    cinemaHall: cinemaHallName,
  };
  return projectionInfo;
}
function renderProjectionInfo(responseObject) {
  const projectionInfo = getProjectionInfo(responseObject);
  const movieName = projectionInfo.movie;
  const cinemaHallName = projectionInfo.cinemaHall;
  h2ProjectionInfo.innerHTML =
    "Cinema hall: " + cinemaHallName + "<br> Movie name: " + movieName;
}

function renderSeatsAndInfo() {
  //fetch seat and projection info from api and render data
  fetch(apiUrl)
    .then((response) => response.json())
    .then((tickets) => {
      rows = getNumberOfRows(tickets);
      columns = getNumberOfColumns(tickets);
      populateTable(tickets);
      renderProjectionInfo(tickets);
    });
}

function sendRequestToBook(projectionId, selectedSeats) {
  //sends api request to book a seat
  const numberOfSeats = selectedSeats.length;
  for (i = 0; i < numberOfSeats; i++) {
    const column = selectedSeats[i].column;
    const row = selectedSeats[i].row;

    const apiUrlPut =
      "http://54.227.55.197/api/ticket/book/" +
      projectionId +
      "/row/" +
      row +
      "/column/" +
      column;

    fetch(apiUrlPut, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then(() => {
      location.reload(); //reloads the page so that seat map is updated
    });
  }
}
function clearTable() {
  //removes all data from the table
  const numberOfRows = table.rows.length;
  for (i = 0; i < numberOfRows; i++) {
    table.deleteRow(0);
  }
}
function readTable() {
  //returns array with rows and columns of tickets that user selected
  let selectedSeats = [];
  let rowSelected = 0;
  const allCheckboxes = document.querySelectorAll("input");
  for (i = 0; i < allCheckboxes.length - 1; i++) {
    //iterates through all checkboxes
    if (allCheckboxes[i].checked && !allCheckboxes[i].disabled) {
      if (i == 0) {
        rowSelected = 1;
      } else {
        rowSelected = Math.ceil((i + 1) / columns);
      }
      const columnSelected = i - (rowSelected - 1) * columns + 1;
      const selectedSeat = {
        row: rowSelected,
        column: columnSelected,
      };
      selectedSeats.push(selectedSeat);
    }
  }
  return selectedSeats;
}

function populateTable(responseObject) {
  //renders cinema hall seats to the table with checkboxes
  let id = 0;
  for (i = 0; i <= rows; i++) {
    const newRow = table.insertRow(); //inserts new row into table
    for (j = -1; j < columns; j++) {
      const newCell = newRow.insertCell(); //inserts new cell into row
      if (j == -1 && i < rows) {
        //creates numbering of rows on the left
        newCell.innerHTML = i + 1;
      } else {
        if (i == rows) {
          //creates numbering of columns on the bottom
          newCell.innerHTML = j + 1;
        } else {
          const newInputField = document.createElement("input"); //creating checkbox
          newInputField.setAttribute("type", "checkbox");

          if (isTicketSold(responseObject, id)) {
            //if seat is sold checkbox is checked and disabled
            newInputField.disabled = true;
            newInputField.checked = true;
          }

          newCell.appendChild(newInputField); //inserting checkbox into cell
          id++;
        }
      }
    }
  }
}

function isTicketSold(responseObject, id) {
  //returns true if ticket with this id is sold
  if (responseObject[id].sold == true) {
    return true;
  } else {
    return false;
  }
}

function getNumberOfRows(responseObject) {
  //returns number of rows from response object
  const lastArrayId = responseObject.length - 1;
  const rows = responseObject[lastArrayId].ticketRow;
  return rows;
}
function getNumberOfColumns(responseObject) {
  //returns number of columns from response object
  const lastArrayId = responseObject.length - 1;
  const columns = responseObject[lastArrayId].ticketColumn;
  return columns;
}
