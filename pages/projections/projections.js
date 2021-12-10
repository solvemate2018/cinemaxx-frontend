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
  //Handles the projection functionality, call functions accordingly, sets up the document.
  const repertoireTableElement = document.getElementById("repertoireTableContainer");
  const dateInputElement = document.getElementById("dateInput")
  const dateFromInputElement = document.getElementById("dateInput1")
  const dateToInputElement = document.getElementById("dateInput2")
  const today = new Date().toJSON().slice(0, 10);
  const form1 = document.querySelector("form")
  const form2 = document.querySelectorAll("form")[1];
  form1.addEventListener("submit",(event)=>handelDateSubmition(event,repertoireTableElement,dateInputElement))
  form2.addEventListener("submit",(event)=>handel2DatesSubmition(event,repertoireTableElement,dateFromInputElement,dateToInputElement))
  dateInputElement.setAttribute("min",today);
  dateInputElement.setAttribute("value",today);
  dateFromInputElement.setAttribute("min",today);
  dateFromInputElement.setAttribute("value",today);
  dateToInputElement.setAttribute("min", today)
  dateToInputElement.setAttribute("value", today)
  let projections = await getProjectionsByDate(today);
  handleProjections(repertoireTableElement,projections);
}

function handleProjections(table,projections){
  //function for handling projections after they are fethed. No matter what was recived.
  table.innerHTML="";
  try{
    projections = projections.sort(compareProjectionsByMovieName)
    projections = groupBy(projections,"movie");  
    generateTables(table,projections)
  }catch(err){}
}

async function handelDateSubmition(event,table,dateInput){
  //function for fetching submitions given one date
  event.preventDefault();
  let date = dateInput.value;
  let projections = await getProjectionsByDate(date)
  handleProjections(table,projections)
}

async function handel2DatesSubmition(event, table,dateFromInput,dateToInput){
  //function for fetching submitions given two dates.
  event.preventDefault();
  let dateFrom = dateFromInput.value;
  let dateTo = dateToInput.value;
  let projections = await getProjectionsBetweenDates(dateFrom,dateTo)
  handleProjections(table,projections)
}

function getProjectionsByDate(date) {
  //fetches projections with one date as variable
  const apiLinkForCurrentDate =
    API_PROJECTIONS_WITH_THEATER_LINK + "/getByDate?date=" + date;
  return getProjections(apiLinkForCurrentDate);
}

function getProjectionsBetweenDates(dateFrom, dateTo) {
  //fetches projections with two dates as variables
  const apiLinkWithTwoDates =
    API_PROJECTIONS_WITH_THEATER_LINK +
    "/getByTwoDates?dateFrom=" +
    dateFrom +
    "&dateTo=" +
    dateTo;
  return getProjections(apiLinkWithTwoDates);
}


function getProjections(key) {
  //function for fetching projections
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

function compareProjectionsByMovieName(a, b) {
  //Compares projections by movie name. Used for sorting
  if (a.movie.name < b.movie.name) {
    return -1;
  }
  if (a.movie.name > b.movie.name) {
    return 1;
  }
  return 0;
}

function groupBy(arr, movie) {
  //Really cool function for splitiing an array into object containing subarrays based
  //on a property of the object. In this case, movie name.
  return arr.reduce(function(memo, x) {
    if (!memo[x[movie].name]) { memo[x[movie].name] = []; }
    memo[x[movie].name].push(x);
    return memo;
  }, {});
}

function generateTables(tablesContainer, projections) {
  //Function for generating all the tables containing all movies and their projections.
  const tHeaderDescription =["Movie title","Genre","Age Limit","Movie Details"];
  const tBodyDescription =["Start Time","Duration","Hall","Ticket Price","Book Movie"];

  for (let key in projections) {
    const movieCon = projections[key];
    const ageLimit = movieCon[0].movie.category.name+" - "+ movieCon[0].movie.category.ageLimit
    const movieData =[movieCon[0].movie.name, movieCon[0].movie.genre.name, ageLimit]
    const tableMovies = document.createElement("table");
    const tableProjections = document.createElement("table");
    tableMovies.setAttribute("class","movie-table");
    tableProjections.setAttribute("class","projection-table");

    const movieDescriptionRow = tableMovies.insertRow();
    const movieInfoRow = tableMovies.insertRow();
    const projectionDescriptionRow = tableProjections.insertRow();

    tHeaderDescription.forEach((text)=>generateCellsInRow(movieDescriptionRow,text));
    movieData.forEach((text)=>generateCellsInRow(movieInfoRow,text))
    const movieId = movieCon[0].movie.id;
    generateMovieDetailButton(movieInfoRow, movieId);
    tBodyDescription.forEach((text)=>generateCellsInRow(projectionDescriptionRow,text))
    movieCon.forEach((projection)=>{
      const startTimeArray = projection.startTime;
      const startTimeDate = startTimeArray.slice(0,-3)
      const startTimeHour = startTimeArray.slice(-3,-1)
      const startTime = startTimeDate.join("-")+"  "+startTimeHour.join(":")
      let data = [
        startTime,
        projection.movie.durationInMinutes +" min.",
        projection.cinemaHallName,
        projection.ticketPrice +"$",
      ];
      let row = tableProjections.insertRow();
      data.forEach((info) => generateCellsInRow(row, info));
      generateBookTicketButton(row,projection.id);
    });
    tablesContainer.appendChild(tableMovies);
    tablesContainer.appendChild(tableProjections)
  }
}

function generateCellsInRow(row, info) {
  //Function for generating cell in a row with given data.
  let cell = row.insertCell();
      let text = document.createTextNode(info);
      cell.appendChild(text);
}

function generateBookTicketButton(row, projectionID){
  //Function for generating cell with button for navigating to book ticket page.
  let bookTicketCell = row.insertCell();
  let bookTicketButton = document.createElement("a");
  bookTicketButton.classList.add('btn','btn-primary');
  bookTicketButton.href="/#/ticket/"+projectionID;
  bookTicketButton.setAttribute("role","button");
  bookTicketButton.innerHTML="book ticket";
  
  bookTicketCell.appendChild(bookTicketButton);
}

function generateMovieDetailButton(row, movieId){
  //Function for generating cell with button for navigating to movie details page.
  let movieDetailsCell = row.insertCell();
  let movieDetailsButton = document.createElement("a");

  movieDetailsButton.classList.add('btn','btn-primary');
  movieDetailsButton.href="/#/"+movieId;
  movieDetailsButton.setAttribute("role","button");
  movieDetailsButton.innerHTML="movie details";
  
  movieDetailsCell.appendChild(movieDetailsButton);
}