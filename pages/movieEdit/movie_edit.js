import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
let apiUrl = "";
let apiKeyGenre = "";
let apiKeyCategory = "";
let userJWTToken = "";

export default (movieId) => {
  userJWTToken = JSON.parse(localStorage.getItem("user"));

  kickIfNotAdmin();

  const content = document.querySelector(".content");
  const apiKey = `${window.apiUrl}api/`;
  apiUrl = apiKey + "movie/" + movieId;
  apiKeyGenre = apiKey + "genre";
  apiKeyCategory = apiKey + "category";

  return fetch("./pages/movieEdit/movie_edit.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;

      const movieNameField = document.querySelector("input.movie-name");
      const durationField = document.querySelector("input.duration");
      const genreField = document.querySelector("select.genre");
      const categoryField = document.querySelector("select.category");
      const submitBtn = document.querySelector("input.submit");

      renderNavBar();
      renderFooter();

      fetchAndRenderMovie(
        movieNameField,
        durationField,
        genreField,
        categoryField
      );

      submitBtn.addEventListener("click", () => {
        const updatedMovie = getUpdatedMovie(
          movieNameField,
          durationField,
          genreField,
          categoryField
        );
        updateMovie(updatedMovie);
      });
    });
};

function fetchAndRenderMovie(
  movieNameField,
  durationField,
  genreField,
  categoryField
) {
  //fetches movie
  fetch(apiUrl)
    .then((response) => {
      return response.json();
    })
    .then((movie) => {
      renderMovieData(
        movie,
        movieNameField,
        durationField,
        genreField,
        categoryField
      );
    });
}

async function renderMovieData(
  movie,
  movieNameField,
  durationField,
  genreField,
  categoryField
) {
  //renders movie data into input fields
  movieNameField.value = movie.name;
  durationField.value = movie.durationInMinutes;

  const categories = await fetchAllCategories();
  const genres = await fetchAllGenres();
  generateOptions(genreField, genres);
  generateOptions(categoryField, categories);
}

function getUpdatedMovie(
  movieNameField,
  durationField,
  genreField,
  categoryField
) {
  const categoryObj = {
    //this.options[this.selectedIndex].text
    name: categoryField.options[categoryField.selectedIndex].text.charAt(0),
  };
  const genreObj = {
    name: genreField.options[genreField.selectedIndex].text,
  };
  const movie = {
    name: movieNameField.value,
    durationInMinutes: durationField.value,
    category: categoryObj,
    genre: genreObj,
  };
  return movie;
}

function updateMovie(updatedMovie) {
  fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
      Authorization: "Bearer " + userJWTToken.accessToken,
    },
    body: JSON.stringify(updatedMovie),
  }).then((response) => {
    if (response.ok) {
      alert("Movie has been updated successfully");
      window.location.href = "/#/movies";
    } else {
      alert("An error occured, reload the page and try again");
      location.reload();
    }
  });
}

function checkIfUserIsAdmin() {
  if (userJWTToken != null && userJWTToken.roles.includes("ROLE_ADMIN")) {
    return true;
  } else {
    return false;
  }
}

function kickIfNotAdmin() {
  if (!checkIfUserIsAdmin()) {
    alert("You need to be logged in as an admin to visit this page");
    window.location.href = "/#/login";
  }
}

function fetchAllGenres() {
  //function for getting all the genres
  const genres = fetch(apiKeyGenre, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      // attaching the JWT token to the request
      Authorization: "Bearer " + userJWTToken.accessToken,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
  return genres;
}

function fetchAllCategories() {
  //function for getting all the categories
  const categories = fetch(apiKeyCategory, {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + userJWTToken.accessToken,
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
  return categories;
}

function generateOptions(selectionElement, data) {
  //Function for generating options for <select> tags. Works both for genres and categories
  data.forEach((info) => {
    let option = document.createElement("option");
    option.setAttribute("value", info.id);
    option.innerHTML = info.name;
    if (info.hasOwnProperty("ageLimit")) {
      option.innerHTML += " - " + info.ageLimit;
    }
    selectionElement.appendChild(option);
  });
}
