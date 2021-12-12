import renderFooter from "/pages/shared/footer/footer.js";
import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
export default (theaterID, movieID) => {
  const content = document.querySelector(".content");

  return fetch("./pages/adminProjections/createProjections.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      generateDynamicContent(theaterID, movieID);
      renderNavBar();
      renderFooter();
    });
};
let counter = 1;


async function generateDynamicContent(theaterID, movieID){
  const theater = await fetchCinemaHalls(theaterID);
  generateContent(theater, movieID);
}

function fetchCinemaHalls(theaterID){
  const theater =  fetch(`${window.apiUrl}api/theater/${theaterID}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
    return theater;
}

function generateContent(theater, movieID){
    theater.cinemaHallDTOList.forEach(cinemaHall => {
        generateContentForCinemaHall(theater, cinemaHall, movieID);
    });
}

function generateContentForCinemaHall(theater, cinemaHall, movieId){
  const createProjectionForm = document.createElement("div");

  const header = document.createElement("h1");
  header.classList.add("display-6");
  header.innerText = "Theater: " + theater.name + " Hall: " + cinemaHall.name;
  createProjectionForm.appendChild(header);

  const formForPickingDateAndTime = document.createElement("div");

  generateDateTimePicker(formForPickingDateAndTime, cinemaHall.id, movieId);
  createProjectionForm.appendChild(formForPickingDateAndTime);
  document.querySelector("#main").appendChild(createProjectionForm);
}

function generateDateTimePicker(upperDiv, id, movieId){
  const form = document.createElement("form");
  upperDiv.appendChild(form);

  const formOutline = document.createElement("div");
  formOutline.classList.add("form-outline", "mb-4");
  form.appendChild(formOutline);

  const labelDate = document.createElement("label");
  labelDate.classList.add("form-label");
  labelDate.setAttribute("for", "form1Example13");
  labelDate.innerText = "Choose Date:   ";
  formOutline.appendChild(labelDate);

  const inputDate = document.createElement("input");
  inputDate.setAttribute("type", "date");
  inputDate.id = "Date:" + id;
  formOutline.appendChild(inputDate);


  const labelTime = document.createElement("label");
  labelTime.classList.add("form-label");
  labelTime.setAttribute("for", "form1Example13");
  labelTime.innerText = "Choose Time:   ";
  formOutline.appendChild(labelTime);

  const inputTime = document.createElement("input");
  inputTime.setAttribute("type", "time");
  inputTime.id = "Time:" + id;
  formOutline.appendChild(inputTime);

  const submitButton = document.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.classList.add("btn", "btn-primary");
  submitButton.id = "Submit:" + id;
  submitButton.innerText = "Create Projection";
  form.appendChild(submitButton);

  form.addEventListener("submit",(event) => createProjection(event, inputDate, inputTime, id, movieId))
}

function createProjection(event, date, time, cinemaHallId, movieId){
  let javaDateTime = convertDateTime(date.value, time.value);

  fetch(`${window.apiUrl}api/projection/movie/${movieId}/hall/${cinemaHallId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
    },
    body: JSON.stringify({
      startTime: javaDateTime,
      ticketPrice: 16.5,
    }),
  })
    .then((response) => response.json())
    .then(()=>{window.router.navigate("/")})

}
function convertDateTime(date, time){
  return date + "T" + time;
}