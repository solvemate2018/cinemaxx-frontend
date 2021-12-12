import renderFooter from "/pages/shared/footer/footer.js";
import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/main/main.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      if(localStorage.getItem("user") != null && JSON.parse(localStorage.getItem("user")).roles.includes('ROLE_ADMIN')){
        generateAdminContent();
      }
      else{
        generateDynamicContent();
      }
      renderNavBar();
      renderFooter();
    });
};


async function generateDynamicContent(){
  const theaters = await fetchTheaters();
  generateLinks(theaters);
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
link.href = "/#/theater/" + theater.id +"/projections";
listOfLinks.appendChild(li);
li.appendChild(link);
});
}

function generateAdminContent(){
  
}
