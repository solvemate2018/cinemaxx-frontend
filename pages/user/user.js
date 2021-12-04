export default (userId) => {
  const userJWTToken = JSON.parse(localStorage.getItem("user"));
  if (userJWTToken) {
    const content = document.querySelector(".content");

    fetch("./pages/user/user.html")
      .then((response) => response.text())
      .then((userHtml) => {
        content.innerHTML = userHtml;

        const h2 = document.querySelector("h2");
        h2.innerText = `${userId}'s user page`;

        fetch(`${window.apiUrl}/api/orders`, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            // attaching the JWT token to the request
            Authorization: "Bearer " + userJWTToken.accessToken,
          },
        })
      });
  } else {
    alert("Please login to access this site");
  }
};
