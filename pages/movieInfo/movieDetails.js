import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
import renderFooter from "/pages/shared/footer/footer.js";

const api_movies_details = "http://54.227.55.197/api/movie/details/2"
const api_movies_details = 'response_1638646668518.json'; // "http://54.227.55.197/api/movie/details"
//const Movieurl = api_movies_details + MovieId;
showmovie(api_movies_details);
let link = "https://www.imdb.com/video/vi1175821337"

function getEmbedLink(link) {
   let videoLink = link.substring(26);
   let imdbLink = link.slice(0, 26);
   let embedLink = imdbLink + "/imdb" + videoLink + "/imdb/embed"
   return embedLink;
}


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
    
   fetch(url)
      .then(response => response.json())
      .then(data => {
         console.log(data);
         var mainContainer = document.getElementById("movie");
         const el = document.createElement("div");

         const title = document.createElement("h1");
         title.innerHTML = data.title;

         const textInfo = document.createElement("section");
         textInfo.id = "info";

         const list = document.createElement("ul");
         const releaseDate = document.createElement("li")
         releaseDate.innerHTML = 'Release date: ' + data.releaseDate;
         const imDbRating = document.createElement("li");
         imDbRating.innerHTML = 'imDb Rating: ' + data.imDbRating;
         const Duration = document.createElement("li");
         Duration.innerHTML = 'Duration: ' + data.runtimeStr;
         textInfo.appendChild(title);
         list.appendChild(releaseDate);
         list.appendChild(imDbRating);
         list.appendChild(Duration);
         textInfo.appendChild(list);

         el.appendChild(textInfo);

         const media = document.createElement("section");



         const poster = document.createElement('img');
         poster.src = data.posterUrls[1]
         poster.width = "300"
         poster.height = "500"


         const trailer = document.createElement("iframe");

         trailer.src = getEmbedLink(data.trailerUrl)
         trailer.width = "854"
         trailer.height = "500"
         trailer.allowfullscreen = "true"
         trailer.mozallowfullscreen = "true"
         trailer.webkitallowfullscreen = "true"
         trailer.frameborder = "no"

         media.appendChild(poster);
         media.appendChild(trailer)
         /*
         
                  const photos = document.createElement("div");
                  const photosTitle = document.createElement("h1");
         
                  photosTitle.innerHTML = "Photo Gallery"
         
                  const image = document.createElement('img');
                  image.id = "1"
                  image.src = data.imageUrls[0]
         
         
         
                  const image2 = document.createElement('img');
                  image2.src = data.imageUrls[1]
         
                  const image3 = document.createElement('img');
                  image3.src = data.imageUrls[2]
         
         
         
         
         
                  photos.appendChild(image);
                  photos.appendChild(image2);
                  photos.appendChild(image3);
         */


         el.appendChild(media)
         //el.appendChild(photos)





         const ActorsNames = document.createElement("h3");
         ActorsNames.innerHTML = "Actors";
         el.appendChild(ActorsNames)
         const jsonActors = data.actorList;
         const jsonString = JSON.stringify(jsonActors);
         const actors = JSON.parse(jsonString);
         for (let i = 0; i < actors.length; i++) {
            const actorList = document.createElement("li");

            actorList.innerHTML = actors[i].name + " as " + actors[i].asCharacter;
            el.appendChild(actorList);
         }


         mainContainer.appendChild(el);


      })
      .catch((error) => {
         console.log(error);
      })
};


