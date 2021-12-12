import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
let apiUrl = "";

export default (projectionId) => {
  const content = document.querySelector(".content");
  apiUrl = `${window.apiUrl}api/ticket/projection/` + projectionId;

  return fetch("./pages/ticket/ticket.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;

      const submitBtn = document.querySelector(".submit-btn");

      renderNavBar();
      renderFooter();

      renderSeatsAndInfo();
      submitBtn.addEventListener("click", () => {
        const selectedSeats = readTable();
        sendRequestToBook(projectionId, selectedSeats);
      });
    });
};

let rows = 0;
let columns = 0;

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
function renderProjectionInfo(responseObject, h2ProjectionInfo) {
  const projectionInfo = getProjectionInfo(responseObject);
  const movieName = projectionInfo.movie;
  const cinemaHallName = projectionInfo.cinemaHall;
  h2ProjectionInfo.innerHTML =
    "Cinema hall: " + cinemaHallName + "<br> Movie name: " + movieName;
}

function renderSeatsAndInfo() {
  const table = document.querySelector("table");
  const h2ProjectionInfo = document.querySelector("h4");
  //fetch seat and projection info from api and render data
  fetch(apiUrl)
    .then((response) => response.json())
    .then((tickets) => {
      rows = getNumberOfRows(tickets);
      columns = getNumberOfColumns(tickets);
      populateTable(tickets, table);
      renderProjectionInfo(tickets, h2ProjectionInfo);
    });
}

function sendRequestToBook(projectionId, selectedSeats) {
  //sends api request to book a seat
  const userJWTToken = JSON.parse(localStorage.getItem("user"));
  if (userJWTToken != null) {
    const numberOfSeats = selectedSeats.length;
    for (let i = 0; i < numberOfSeats; i++) {
      const column = selectedSeats[i].column;
      const row = selectedSeats[i].row;

      const apiUrlPut =
        `${window.apiUrl}api/ticket/book/` +
        projectionId +
        "/row/" +
        row +
        "/column/" +
        column;

      fetch(apiUrlPut, {
        method: "PUT",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          // attaching the JWT token to the request
          Authorization: "Bearer " + userJWTToken.accessToken,
        },
      })
        .then((response) => {
          if (response.ok) {
            location.reload(); //reloads the page so that seat map is updated
          }
        })
        .catch((error) => {
          if (response.status == 401) {
            alert("Please log in in order to book a ticket");
          } else {
            alert("Strange error occured, try again");
          }
        });
    }
  } else {
    alert("Please log in in order to book a ticket");
    window.location.href = "/#/login";
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
  for (let i = 0; i < allCheckboxes.length - 1; i++) {
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

function populateTable(responseObject, table) {
  //renders cinema hall seats to the table with checkboxes
  let id = 0;
  for (let i = 0; i <= rows; i++) {
    const newRow = table.insertRow(); //inserts new row into table
    for (let j = -1; j < columns; j++) {
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
