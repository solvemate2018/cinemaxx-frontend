import renderMain from "./pages/main/main.js";
import renderAbout from "./pages/about/about.js";
import renderLogin from "./pages/login/login.js";
import renderSignUp from "./pages/signUp/signUp.js";
import renderProjections from "./pages/projections/projections.js";
import renderTickets from "./pages/ticket/ticket.js";
import renderNavBar from "./pages/shared/nav-bar/nav-bar.js";
import renderFooter from "./pages/shared/footer/footer.js";

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
      signup: () => {
        renderSignUp();
      },
      "theater/:theaterID/projections": ({ data }) => {
        renderProjections(data.theaterID);
      },
      "/ticket/:projectionId/": ({ data }) => {
        renderTickets(data.projectionId);
      },
    })
    .resolve();
}
