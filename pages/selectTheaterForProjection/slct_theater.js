import renderFooter from "/pages/shared/footer/footer.js";
import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";

let apiUrl = "";

export default () => {
  kickIfNotAdmin();
  const content = document.querySelector(".content");
  apiUrl = `${window.apiUrl}api/theater`;

  return fetch("./pages/selectTheaterForProjection/slct_theater.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;
      renderNavBar();
      renderFooter();
      generateDynamicContent();
    });
};

async function generateDynamicContent() {
  const theaters = await fetchTheaters();
  generateLinks(theaters);
}

function fetchTheaters() {
  const theaters = fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
  return theaters;
}

function generateLinks(theaters) {
  const listOfLinks = document.querySelector(".list-group");

  theaters.forEach((theater) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item");
    let link = document.createElement("a");
    link.innerText = theater.name;
    link.href = `/#/theater/${theater.id}/movie`; //link needs to be chaned
    listOfLinks.appendChild(li);
    li.appendChild(link);
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
