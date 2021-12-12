import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
let apiUrl = "";
export default (movieId) => {
  kickIfNotAdmin();

  const content = document.querySelector(".content");
  apiUrl = `http://54.227.55.197/api/movie/` + movieId;
  console.log(apiUrl);

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

function renderMovieData(
  movie,
  movieNameField,
  durationField,
  genreField,
  categoryField
) {
  //renders movie data into input fields
  movieNameField.value = movie.name;
  durationField.value = movie.durationInMinutes;
  genreField.value = movie.genre.name;
  categoryField.value = movie.category.name;
}

function getUpdatedMovie(
  movieNameField,
  durationField,
  genreField,
  categoryField
) {
  const categoryObj = {
    name: categoryField.value,
  };
  const genreObj = {
    name: genreField.value,
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
  const userJWTToken = JSON.parse(localStorage.getItem("user"));

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
    } else {
      alert("An error occured, reload the page and try again");
    }
    window.location.href = "/#/movies";
  });
}

function checkIfUserIsAdmin() {
  const userJWTToken = JSON.parse(localStorage.getItem("user"));
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
