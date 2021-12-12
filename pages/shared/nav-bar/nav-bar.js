export default () => {
  generateNavBar();
};

function checkIfUserIsLogged() {
  if (localStorage.getItem("user") != null) {
    changeLoginToLogout();
  }
}

function changeLoginToLogout() {
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
  logoutNav.appendChild(logoutLink);
  logoutLink.href = "/";
  logoutLink.addEventListener("click", logout);
}

async function generateNavBar() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user != null && user.roles.includes('ROLE_ADMIN')) {
    await fetchAdminNavBar();
  }
  else {
    await fetchNavBar();
  }
}

function fetchNavBar() {
  fetch('./pages/shared/nav-bar/nav-bar.html').then(function (response) {
    return response.text();
  }).then(function (html) {
    const header = document.querySelector("header");
    header.innerHTML = html;
    checkIfUserIsLogged();
    return doc;
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}

function logout() {
  localStorage.removeItem("user");
}


function fetchAdminNavBar() {
  fetch('./pages/shared/nav-bar/adminnav-bar.html').then(function (response) {
    return response.text();
  }).then(function (html) {
    const header = document.querySelector("header");
    header.innerHTML = html;

    const logoutLink = document.querySelector("#Logout");
    logoutLink.addEventListener("click", logout);
    return doc;
  }).catch(function (err) {
    console.warn('Something went wrong.', err);
  });
}
