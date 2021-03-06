import renderFooter from "/pages/shared/footer/footer.js";
import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
export default (theaterID) => {


    const content = document.querySelector(".content");

    return fetch("./pages/admin/movieListScheduleTime.html")
        .then((response) => response.text())
        .then((mainHtml) => {
            content.innerHTML = mainHtml;
            const api_movies = "http://54.227.55.197/api/movie"
            getMovies(api_movies, theaterID);
            renderNavBar();
            renderFooter();
        })
}


const api_movies = "http://54.227.55.197/api/movie"

function getMovies(url, theaterID) {

    fetch(url)
        .then(response => response.json())
        .then(data => {

            createTable(data, theaterID);

        })
        .catch((error) => {
            console.log(error);
        })
};

function createTable(array, theaterID) {
    var mainContainer = document.getElementById("movieList")
    const tHeader = ["Movie title", "Duration", "Genre", "Age Limit", "Projections"];
    var table = document.createElement("table");


    const movieDescriptionRow = table.insertRow();
    tHeader.forEach((text) => createCell(movieDescriptionRow, text));
    for (let j = 0; j < array.length; j++) {
        let movieRow = table.insertRow();
        let test = array[0];
        createCell(movieRow, array[j].name);
        createCell(movieRow, array[j].durationInMinutes);
        createCell(movieRow, array[j].genre.name);
        createCell(movieRow, array[j].category.name + "-" + array[j].category.ageLimit);
        addProjectionBtn(movieRow, array[j].id, theaterID);
    }


    mainContainer.appendChild(table)
}

function detailsButton(row, movieId) {
    const detailsCell = row.insertCell();
    const detailsBtn = document.createElement("a");
    detailsBtn.classList.add('btn', 'btn-primary');
    detailsBtn.href = "/#/details/" + movieId;
    detailsBtn.innerText = "See movie Details"
    detailsCell.appendChild(detailsBtn);

}

function addProjectionBtn(row, movieID, theaterID) {
    const ProjectionCell = row.insertCell();
    const ProjecitonBtn1 = document.createElement("a");
    ProjecitonBtn1.classList.add('btn', 'btn-primary');
    ProjecitonBtn1.href = `/#/theater/${theaterID}/movie/${movieID}`;
    ProjecitonBtn1.innerText = "Schedule Time"
    ProjectionCell.appendChild(ProjecitonBtn1);
}



function createCell(row, info) {
    let cell = row.insertCell();
    let text = document.createTextNode(info);
    cell.appendChild(text);
}






