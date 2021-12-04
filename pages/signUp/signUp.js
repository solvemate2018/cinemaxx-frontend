export default () => {
    const content = document.querySelector(".content");
  
    return fetch("./pages/signUp/signUp.html")
      .then((response) => response.text())
      .then((loginHtml) => {
        content.innerHTML = loginHtml;
  
        handleLoginFunctionality();
      });
  };
  
  function handleLoginFunctionality() {
    const form = document.querySelector("form");
    form.addEventListener("submit", (event) => {
      // Make sure the form is not submitted
      event.preventDefault();

      if(document.querySelector('#Password').value === document.querySelector('#RepeatedPassword').value){

      fetch(`${window.apiUrl}api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: document.querySelector('#Email').value,
          username: document.querySelector('#Username').value,
          role: [],
          password: document.querySelector('#Password').value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.accessToken) {
            // Saving the JWT to local storage
            localStorage.setItem("user", JSON.stringify(data));
            // navigating to the users route. Using the global window.router
            window.router.navigate(`/user/${data.id}`);
            window.alert(data.message);
          }
        });

      }
    });
  }
  