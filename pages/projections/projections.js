import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
let API_PROJECTIONS_WITH_THEATER_LINK = "";

export default (theaterID) => {
  const content = document.querySelector(".content");
  API_PROJECTIONS_WITH_THEATER_LINK = `${window.apiUrl}api/projection/theater/`+theaterID

  return fetch("./pages/projections/projections.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      handleProjectionFunctionality();
      renderNavBar();
      renderFooter();
    });
};

async function handleProjectionFunctionality() {
  const repertoireTableElement = document.getElementById("repertoireTable");
  const dateInputElement = document.getElementById("dateInput")
  const today = new Date().toJSON().slice(0, 10);
  const form = document.querySelector("form")
  form.addEventListener("submit",(event)=>handelDateSubmition(event,repertoireTableElement))
  dateInputElement.setAttribute("min",today);
  dateInputElement.setAttribute("value",today);
  let projections = await getProjectionsByDate(today);
  projections = rearrangeProjections(projections);
  generateTable(repertoireTableElement, projections);
}

async function handelDateSubmition(event,repertoireTableElement){
  event.preventDefault();
  let date = document.querySelector("#dateInput").value;
  deleteAllRowsExceptTheHeader(repertoireTableElement)
  let projections = await getProjectionsByDate(date)
  projections = rearrangeProjections(projections);
  generateTable(repertoireTableElement, projections)
}

function getProjections(key) {
  const projection = fetch(key, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
  return projection;
}

function getProjectionsByDate(date) {
  const apiLinkForCurrentDate =
    API_PROJECTIONS_WITH_THEATER_LINK + "/getByDate?date=" + date;
  return getProjections(apiLinkForCurrentDate);
}

function getProjectionsBetweenDates(dateFrom, dateTo) {
  const apiLinkWithTwoDates =
    API_PROJECTIONS_WITH_THEATER_LINK +
    "/getByTwoDates?dateFrom=" +
    dateFrom +
    "&dateTo=" +
    dateTo;
  return getProjections(apiLinkWithTwoDates);
}

function rearrangeProjections(initialProjections){
  let projections = initialProjections.sort(compareProjectionsByMovieName);

  //TO:DO make this function rearange projections by movies and time
  //Right now it is just sorting by movies

  return projections
}

function compareProjectionsByMovieName(a, b) {
  if (a.movie.name < b.movie.name) {
    return -1;
  }
  if (a.movie.name > b.movie.name) {
    return 1;
  }
  return 0;
}

function generateTable(table, projections) {
  projections.forEach((projection) => {
    const startTimeArray = projection.startTime;
    const startTimeDate = startTimeArray.slice(0,-3)
    const startTimeHour = startTimeArray.slice(-3,-1)
    const startTime = startTimeDate.join("-")+"  "+startTimeHour.join(":")
    const ageLimit = projection.movie.category.name+" - "+ projection.movie.category.ageLimit
    let data = [
      projection.movie.name,
      projection.movie.genre.name,
      ageLimit,
      startTime,
      projection.movie.durationInMinutes +" min.",
      projection.cinemaHallName,
      projection.ticketPrice +"$",
    ];
    let row = table.insertRow();
    data.forEach((info) => generateCellsInRow(row, info));
  });
}

function generateCellsInRow(row, info) {
  let cell = row.insertCell();
      let text = document.createTextNode(info);
      cell.appendChild(text);
}

function deleteAllRowsExceptTheHeader(table){
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
}
