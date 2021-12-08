export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/main/main.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      generateDynamicContent();
    });
};

async function generateDynamicContent(){
  const theaters = await fetchTheaters();
  generateLinks(theaters);
  checkIfUserIsLogged();
}

function fetchTheaters(){
  const theaters =  fetch(`${window.apiUrl}api/theater`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
    return theaters;
}

function generateLinks(theaters){
const listOfLinks = document.querySelector(".list-group");

theaters.forEach(theater => {
let li = document.createElement("li");
li.classList.add("list-group-item");
let link = document.createElement("a");
link.innerText = theater.name;
link.href = "./theater/" + theater.id +"/projections";
listOfLinks.appendChild(li);
li.appendChild(link);
});
}

function checkIfUserIsLogged(){
  if(localStorage.getItem("user") != null){
    document.querySelector(".nav-item").remove();
    document.querySelector(".nav-item").remove();

    const navbar = document.querySelector(".navbar-nav");
    const logoutNav = document.createElement("li");
    logoutNav.classList.add("nav-item");
    const logoutLink = document.createElement("a");
    logoutLink.classList.add("nav-link");
    logoutLink.classList.add("text-dark");
    logoutLink.innerText = "Logout";
    navbar.appendChild(logoutNav);
    navbar.appendChild(logoutLink);
  }
}
