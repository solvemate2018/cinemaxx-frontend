import renderMain from "./pages/main/main.js";
import renderAbout from "./pages/about/about.js";
import renderLogin from "./pages/login/login.js";
import renderSignUp from "./pages/signUp/signUp.js";
import renderProjections from "./pages/projections/projections.js"

export default function () {
  window.router = new Navigo("/", { hash: true });

  router
    .on({
      "/": () => {
        // call updatePageLinks to let navigo handle the links
        // when new links have been inserted into the dom
        renderMain().then(router.updatePageLinks);
      },
      about: () => {
        renderAbout();
      },
      login: () => {
        renderLogin();
      },
      signUp: () => {
        renderSignUp();
      },
       "theater/:theaterID/projections": ({data}) =>{
        renderProjections(data.theaterID)
      }
    })
    .resolve();
}
