import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";
const api_movies_details = "http://54.227.55.197/api/movie/details/2"
//const Movieurl = api_movies_details + MovieId;
showmovie (api_movies_details);

function showmovie(url) {
fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        var mainContainer = document.getElementById("movie");
        const el = document.createElement("div");
   
        const title = document.createElement("h2");
     title.innerHTML = data.fullTitle;

        const image = document.createElement('img');
     image.src =  data.posterUrls[1]
     image.width = "300"
    
        const releaseDate = document.createElement("p")
     releaseDate.innerHTML = 'Release date: ' + data.releaseDate;

     const imDbRating = document.createElement("p");
        imDbRating.innerHTML = 'imDb Rating: ' + data.imDbRating;

     const Duration = document.createElement("p");
     Duration.innerHTML = 'Duration: ' + data.runtimeStr;

     const trailer = document.createElement ("a");
        trailer.innerHTML = "trailer: " + data.trailerUrl;
        trailer.href=data.trailerUrl;


        /* const trailer = document.createElement ("iframe");
        trailer.width="420";
        trailer.height="315";
        trailer.src= data.trailerUrl; */


       
        //actorList.innerHTML =  JSON.stringify(data.actorList[1].name) + "as character" + JSON.stringify(data.actorList[1].asCharacter);

         el.appendChild(title);
         el.appendChild(image);
         el.appendChild(releaseDate);
        el.appendChild(imDbRating);
        el.appendChild(Duration);
        el.appendChild(trailer);
        const ActorsNames = document.createElement("h3");
        ActorsNames.innerHTML = "Actors";
        el.appendChild(ActorsNames)
        const jsonActors = data.actorList;
        const jsonString = JSON.stringify(jsonActors);
        const actors = JSON.parse(jsonString);
        for(let i=0; i<actors.length; i++) 
       { const actorList = document.createElement ("p");
        actorList.innerHTML = actors[i].name + " as " + actors[i].asCharacter;
     el.appendChild(actorList);}

     mainContainer.appendChild(el);
      renderNavBar();
      renderFooter();
    })
    .catch((error) => {
        console.log(error);
    })};
    
    

