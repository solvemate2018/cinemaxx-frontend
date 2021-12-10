export default () => {
    generateFooter();
  };


  async function generateFooter(){
    await fetchFooter();
  }

function fetchFooter(){
    fetch('./pages/shared/footer/footer.html').then(function (response) {
        return response.text();
    }).then(function (html) {
        const footer = document.querySelector("footer");
        console.log(html);
        footer.innerHTML = html;
    }).catch(function (err) {
        console.warn('Something went wrong.', err);
    });
  }
