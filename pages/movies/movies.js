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
    console.log(movies)
    const tHeaderDescription =["Movie title","Genre","Duration","Age Limit","Movie Details"];

}

function generateCellsInRow(row, info) {
  //Function for generating cell in a row with given data.
  let cell = row.insertCell();
      let text = document.createTextNode(info);
      cell.appendChild(text);
}