import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
let apiKey = "";

export default () => {
  if(isAdmin()){
  const content = document.querySelector(".content");
  apiKey = `${window.apiUrl}api/movie`;
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
    window.location.href = apiKey;
  }
};

function handleAddMovieFunctionality(){

}

function isAdmin(){
    //Function to check if the user has an admin role.
    const userJWTToken = JSON.parse(localStorage.getItem("user"));
    if(userJWTToken==null){return false;}
    return userJWTToken.roles.includes("ROLE_ADMIN");
  }