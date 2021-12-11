import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
let apiKeyMovie = "";
let apiKeyGenre = "";
let apiKeyCategory="";
let userJWTToken = "";

export default () => {
  userJWTToken =  JSON.parse(localStorage.getItem("user"));
  if(isAdmin()){
  const content = document.querySelector(".content");
  const apiKey = `${window.apiUrl}api/`;
  apiKeyMovie = apiKey + "movie";
  apiKeyGenre = apiKey + "genre";
  apiKeyCategory = apiKey + "category"

  return fetch("./pages/addMovie/addMovie.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      handleAddMovieFunctionality();
      renderNavBar();
      renderFooter();
    });
  }else{
    alert("You have to be loged in as admin to access this site.")
    window.location.href = "";
  }
};

async function handleAddMovieFunctionality(){
  //Function for handeling creating the movie 
  const genres = await fetchAllGenres();
  const categories = await fetchAllCategories();
  console.log(genres);
  console.log(categories);

}

function fetchAllGenres(){
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

function fetchAllCategories(){
    //function for getting all the categories
    const categories = fetch(apiKeyCategory, {
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
    return categories;

}

function isAdmin(){
    //Function to check if the user has an admin role.
    if(userJWTToken==null){return false;}
    return userJWTToken.roles.includes("ROLE_ADMIN");
  }