import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
let apiKey = "";

export default () => {
  const content = document.querySelector(".content");
  apiKey = `${window.apiUrl}api/movie`;
  return fetch("./pages/movies/movies.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      console.log(apiKey);
      handleMovieFunctionality();
      renderNavBar();
      renderFooter();
    });
};

async function handleMovieFunctionality() {
  const movieTableContainerElement = document.getElementById("movieTableContainer");
  let movies = await getMovies();
  generateMovies(movieTableContainerElement, movies);
}

function getMovies() {
  const movies = fetch(apiKey, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
  return movies;
}

function generateMovies(tableContainer, movies){
    const tableMovies = document.createElement("table");
    const tHeaderDescription =["Movie title","Genre","Duration","Age Limit","Edit movie"];
    const descriptionRow = tableMovies.insertRow();
    tHeaderDescription.forEach((text)=>generateCellsInRow(descriptionRow,text));
    movies.forEach((movie)=>{generateRow(tableMovies, movie)});
    console.log(movies)

    tableContainer.appendChild(tableMovies);
}

function generateRow(table,movie){
    const ageLimit = movie.category.name+" - "+ movie.category.ageLimit;
    const movieData=[movie.name, movie.genre.name, movie.durationInMinutes +" min.",ageLimit];
    const row = table.insertRow();
    movieData.forEach((info)=>generateCellsInRow(row,info));
    generateEditMovieButton(row, movie.id)
}

function generateCellsInRow(row, info) {
  //Function for generating cell in a row with given data.
  let cell = row.insertCell();
      let text = document.createTextNode(info);
      cell.appendChild(text);
}

function generateEditMovieButton(row, movieID){
  //Function for generating cell with button for navigating to edit movie page.
  let editMovieCell = row.insertCell();
  let editMovieButton = document.createElement("a");

  editMovieButton.classList.add('btn','btn-primary');
  editMovieButton.href="/#/movie/edit/"+movieID;
  editMovieButton.setAttribute("role","button");
  editMovieButton.innerHTML="edit movie";
  editMovieCell.appendChild(editMovieButton);
}