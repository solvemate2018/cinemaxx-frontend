import renderMain from "./pages/main/main.js";
import renderAbout from "./pages/about/about.js";
import renderLogin from "./pages/login/login.js";
import renderSignUp from "./pages/signUp/signUp.js";
import renderProjections from "./pages/projections/projections.js";
import renderTickets from "./pages/ticket/ticket.js";
import renderDetails from "./pages/movieInfo/movieDetails.js";
import renderMovies from "./pages/movies/movies.js";
import renderAddMovie from "./pages/addMovie/addMovie.js";
import renderMovieListScheduleTime from "./pages/admin/movieListScheduleTime.js";
import renderCreateProjection from "./pages/adminProjections/createProjections.js";
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
      movieListScheduleTime: () => {
        renderMovieListScheduleTime();
      },
      "/ticket/:projectionId/": ({ data }) => {
        renderTickets(data.projectionId);
      },
      "theater/:theaterID/projections": ({ data }) => {
        renderProjections(data.theaterID)
      },
      "details/:movieID": ({ data }) => {
        renderDetails(data.movieID)
      },
      movies:() =>{
        renderMovies();
      },
      createProjection:() =>{
        renderCreateProjection();
      },
      "theater/:theaterID/movie/:movieID": ({data}) => {
        renderCreateProjection(data.theaterID, data.movieID);
      },
      "movie/add":() =>{
        renderAddMovie();
      }
    })
    .resolve();
}
