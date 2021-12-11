import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
let apiKey = "";

export default () => {
  if(isAdmin()){
  const content = document.querySelector(".content");
  apiKey = `${window.apiUrl}api/movie`;
  return fetch("./pages/movies/movies.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      handleMovieFunctionality();
      renderNavBar();
      renderFooter();
    });
  }else{
    alert("You have to be loged in as admin to access this site.")
    window.location.href = apiKey;
  }
};

async function handleMovieFunctionality() {
  //Function for handeling all the movie functionality 
  const movieTableContainerElement = document.getElementById("movieTableContainer");
  let movies = await getMovies();
  generateMoviesTable(movieTableContainerElement, movies);
}

function getMovies() {
  //function for getting all the movies
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

function isAdmin(){
  //Function to check if the user has an admin role.
  const userJWTToken = JSON.parse(localStorage.getItem("user"));
  if(userJWTToken==null){return false;}
  return userJWTToken.roles.includes("ROLE_ADMIN");
}

function generateMoviesTable(tableContainer, movies){
  // Function for generating table of movies
    const tableMovies = document.createElement("table");
    const tHeaderDescription =["Movie title","Genre","Duration","Age Limit","Edit movie"];
    const descriptionRow = tableMovies.insertRow();
    tHeaderDescription.forEach((text)=>generateCellsInRow(descriptionRow,text));
    movies.forEach((movie)=>{generateRow(tableMovies, movie)});
    tableContainer.appendChild(tableMovies);
}

function generateRow(table,movie){
  //Function for generating a row in the table
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