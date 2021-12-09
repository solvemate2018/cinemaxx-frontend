import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
export default () => {
  const content = document.querySelector(".content");

  return fetch("./pages/login/login.html")
    .then((response) => response.text())
    .then((loginHtml) => {
      content.innerHTML = loginHtml;

      handleLoginFunctionality();
      renderNavBar();
    });
};

function handleLoginFunctionality() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (event) => {
    // Make sure the form is not submitted
    event.preventDefault();
    console.log(document.querySelector('#form1Example13').value);
    console.log(document.querySelector('#form1Example23').value);

    fetch(`${window.apiUrl}api/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: document.querySelector('#form1Example13').value,
        password: document.querySelector('#form1Example23').value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.accessToken) {
          // Saving the JWT to local storage
          localStorage.setItem("user", JSON.stringify(data));
          // navigating to the users route. Using the global window.router
          window.router.navigate("/");
        }
      });
  });
}
