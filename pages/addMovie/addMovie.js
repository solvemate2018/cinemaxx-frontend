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
    window.router.navigate("/")
  }
};

async function handleAddMovieFunctionality(){
  //Function for handeling creating the movie 
  const titleInputElement = document.getElementById("title-input");
  const durationInputElement = document.getElementById("duration-input");
  const genreInputElement = document.getElementById("select-genre");
  const categoryInputElement = document.getElementById("select-category");
  const categories = await fetchAllCategories();
  const genres = await fetchAllGenres();
  generateOptions(genreInputElement, genres);
  generateOptions(categoryInputElement, categories);
  const form = document.querySelector("form")
  form.addEventListener("submit",(event)=>handleMovieCreation(event,titleInputElement,
    durationInputElement,categoryInputElement,genreInputElement))//Add boxes here later

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
        Authorization: "Bearer " + userJWTToken.accessToken,
      },
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
    return categories;
}

function generateOptions(selectionElement, data){
  //Function for generating options for <select> tags. Works both for genres and categories
  data.forEach((info)=>{
    let option = document.createElement("option");
    option.setAttribute("value", info.id);
    option.innerHTML = info.name;
      if(info.hasOwnProperty("ageLimit")){
        option.innerHTML+=" - "+info.ageLimit;
      }
    selectionElement.appendChild(option);
  })
}

function handleMovieCreation(event, titleElement, durationElement, categoryElement, genreElement){
  //Function for handling creating movies with given data
  event.preventDefault();
  const title = titleElement.value;
  const duration = durationElement.value;
  const categoryID = categoryElement.value;
  const genreID = genreElement.value;
  createMovie(title,duration,categoryID,genreID)
}

function createMovie(title, duration, categoryID, genreID){
  //Function for creating the movie with given data
  const key = apiKeyMovie+"/genre/"+genreID+"/category/"+categoryID;
  console.log(key);
  fetch(key, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + userJWTToken.accessToken,
    },
    body: JSON.stringify({
      name: title,
      durationInMinutes: duration,
    }),
  })
    .then((response) => response.json())
    .then(()=>{window.router.navigate("/movie")})

    //That last redirect is in "then" so that we see the newly created movie
    //on the page showing all movies.
}

function isAdmin(){
    //Function to check if the user has an admin role.
    if(userJWTToken==null){return false;}
    return userJWTToken.roles.includes("ROLE_ADMIN");
  }