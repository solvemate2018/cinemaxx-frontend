/*import renderFooter from "/pages/shared/footer/footer.js";
import renderNavBar from "/pages/shared/nav-bar/nav-bar.js";
export default () => {


    const content = document.querySelector(".content");

    return fetch("./pages/admin/movieListScheduleTime.html")
        .then((response) => response.text())
        .then((mainHtml) => {
            content.innerHTML = mainHtml;
            const api_movies = "http://54.227.55.197/api/movie"
            getMovies(api_movies);
            renderNavBar();
            renderFooter();
        })
}
*/

const api_movies = "http://54.227.55.197/api/movie"
getMovies(api_movies);

function getMovies(url) {

    fetch(url)
        .then(response => response.json())
        .then(data => {

            createTable(data);

        })
        .catch((error) => {
            console.log(error);
        })
};

function createTable(array) {
    var mainContainer = document.getElementById("movieList")
    const tHeader = ["Movie title", "Duration", "Genre", "Age Limit", "Details", "Projections"];
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
        detailsButton(movieRow, j);
        addProjectionBtn(movieRow);
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

function addProjectionBtn(row) {
    const ProjectionCell = row.insertCell();
    const ProjecitonBtn = document.createElement("a");

    ProjecitonBtn.classList.add('btn', 'btn-primary');
    //change with path for adding projection
    //ProjecitonBtn.href = "/#/projection/add";
    ProjecitonBtn.innerText = "Schedule Time"
    if (localStorage.getItem("user") != null && JSON.parse(localStorage.getItem("user")).roles.includes('ROLE_ADMIN'))
        ProjectionCell.appendChild(ProjecitonBtn)

    //If a regular user gets to this page, the button displayed
    //will redirect him to the projections page
    else {
        const ProjecitonBtn1 = document.createElement("a");
        ProjecitonBtn1.classList.add('btn', 'btn-primary');
        ProjecitonBtn1.href = "../projections/projections.html"
        ProjecitonBtn1.innerText = "search projections"
        ProjectionCell.appendChild(ProjecitonBtn1);
    }

}



function createCell(row, info) {
    let cell = row.insertCell();
    let text = document.createTextNode(info);
    cell.appendChild(text);
}






