export default () => {
    generateNavBar();
  };

function checkIfUserIsLogged(){
    if(localStorage.getItem("user") != null){
      changeLoginToLogout();
    }
  }
  
  function changeLoginToLogout(){
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

  async function generateNavBar(){
    await fetchNavBar();
  }

function fetchNavBar(){
    fetch('./pages/shared/nav-bar/nav-bar.html').then(function (response) {
        return response.text();
    }).then(function (html) {
        let nav = document.createElement("nav");
        nav.classList.add(["navbar", "navbar-expand-sm", "navbar-toggleable-sm",
         "navbar-light", "bg-white", "border-bottom", "box-shadow", "mb-3"]);

        nav.innerHTML = html;
        const header = document.querySelector("header");
        header.appendChild(nav);
        checkIfUserIsLogged();
        return doc;
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
  }

function logout(){
    localStorage.removeItem("user");
}
