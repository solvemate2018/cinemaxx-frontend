import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
export default () => {
    const content = document.querySelector(".content");
  
    return fetch("./pages/signUp/signUp.html")
      .then((response) => response.text())
      .then((loginHtml) => {
        content.innerHTML = loginHtml;
  
        handleLoginFunctionality();
        renderNavBar();
        renderFooter();
      });
  };
  
  function handleLoginFunctionality() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
      // Make sure the form is not submitted
      event.preventDefault();

      if(document.querySelector('#Password').value === document.querySelector('#RepeatedPassword').value){
        console.log(document.querySelector('#Email').value);
        console.log(document.querySelector('#Username').value);
        console.log(document.querySelector('#Password').value);

      fetch(`${window.apiUrl}api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: document.querySelector('#Email').value,
          username: document.querySelector('#Username').value,
          role: null,
          password: document.querySelector('#Password').value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.accessToken) {
            // Saving the JWT to local storage
            localStorage.setItem("user", JSON.stringify(data));
            // navigating to the users route. Using the global window.router
            window.router.navigate("./");
          }
          else{
            console.log(data);
          }
          window.alert(data.message);
        });

      }
    });
  }
  