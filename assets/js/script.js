const searchForm = document.querySelector('#search-form');
const cityInput = document.querySelector('#city-input');
const yelp = document.querySelector('.restaurants'); 
const yelpLogo = document.createElement("img");
const searchHistory = document.querySelector('#search-history');

function addToSearchHistory(cityName) {
    let searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) || [];

    const index = searchHistoryArray.indexOf(cityName);
    if (index !== -1) {
        searchHistoryArray.splice(index, 1);
    }
    searchHistoryArray.unshift(cityName);

    if (searchHistoryArray.length > 3) {
        searchHistoryArray.pop();
    }

    localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArray));

    displaySearchHistory(searchHistoryArray);
}

function displaySearchHistory(searchHistoryArray) {
    searchHistory.innerHTML = "";

    for (const city of searchHistoryArray) {
        const listItem = document.createElement("li");
        listItem.textContent = city;
        searchHistory.appendChild(listItem);
    }
}

window.onload = function () {
    const searchHistoryArray = JSON.parse(localStorage.getItem("searchHistory")) || [];
    displaySearchHistory(searchHistoryArray);
};

searchForm.addEventListener('submit', function(e){
    e.preventDefault();
    const cityName = cityInput.value.trim();
    const options = {
        method: 'GET',
        headers: {
            "x-requested-with": "xmlhttprequest",
            "Access-Control-Allow-Origin": "*",
            accept: 'application/json',
            Authorization: 'Bearer TjYoyO8dDXoA2iXALansAO60ZGlYp__d4C4hUhp39jcKd2DxDC7YDe0O26-GicSpcmHboiNMTx__bOFkhi-Syvg0Ro3Dx_vs8_i_mnCzo1gnRk5b5OR1-qT1CLkDZXYx'
        }
    };

    const apiUrl = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${cityName}&sort_by=best_match&limit=20`;
    yelp.innerHTML = '';

    fetch(apiUrl, options)
    .then(response => {
        if (response.status === 403){
            // location.href = response.url;
            window.open(response.url, '_blank');
            location.reload();
        }
        console.log(response);
        return response.json()
    })
    .then(function(data){
    console.log(data);
    yelp.innerHTML += `<div class="box">
                            <h2 style="font-size: 26px; margin-bottom:15px; text-align:center;">Top Rated Restaurants:</h2>
                        </div>`;
    addToSearchHistory(cityName);
        for (let i = 0; i < data.businesses.length; i++) {
            const item = data.businesses[i];
            const name = item.name;
            const rating = item.rating;
            const url = item.url;
            const reviewCount = item.review_count;

            if (rating >= 4) {
                let yelpStar = '';
                if(rating === 5){
                    yelpStar = `<img src="assets/images/web_and_ios/large/large_5.png" alt="5 Stars">`;
                } else if (rating === 4.5){
                    yelpStar = `<img src="assets/images/web_and_ios/large/large_4_half.png" alt="4.5 Stars">`;
                } else if (rating === 4){
                    yelpStar = `<img src="assets/images/web_and_ios/large/large_4.png" alt="4 Stars">`;
                }

                yelpLogo.src = "assets/images/yelpIcon.png";
                yelpLogo.alt = "Yelp Logo";
            
                yelp.innerHTML += `
                    <div class="restaurant-box box">
                        <h3 style="font-size: 20px;">${name}</h3> 
                        <p>${yelpStar}<a href="${url}" target="_blank">${yelpLogo.outerHTML}</a></p>
                        <p style="font-size: 17px;">Based on ${reviewCount} Reviews</p>
                    </div>
                `;

            }
        }
        cityInput.value = '';
    })
    .catch(err => {
        console.error(err)
    });
})

const genreBtn = document.querySelector("#genreBtn");
const genreList = document.querySelector("#genreList");
const movieList = document.querySelector("#movieList");
const genreIdList = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    scienceFiction: 878,
    tVMovie: 10770,
    thriller: 53,
    war: 10752,
    western: 37
};
let genre="";
let genreId = "";
let page = "";

genreBtn.addEventListener("click", function(event){
    event.preventDefault();
    genre = genreList.value;
    genreId = genreIdList[genre];
    genre = genreList.options[genreList.selectedIndex].textContent;
    console.log(genreId);
    movieList.textContent="";
    getMovieApi(genreId,page,genre);
})

function setMovieStorage(page,genreId,title){
    let movieInfo = [];
    movieInfo[0] = page;
    movieInfo[1] = genreId;
    movieInfo[2] = title;
    localStorage.setItem("movieInfo", JSON.stringify(movieInfo));
}
function addTitle(title){
    const header = document.createElement("h1");
    const headerContainer = document.createElement("div");
    title = title.toUpperCase();
    header.textContent = title;
    header.setAttribute("class", "text-center");
    headerContainer.setAttribute("class", "box");
    headerContainer.appendChild(header);
    movieList.appendChild(headerContainer);
}
function getWatchProviders(id){
    var requestUrl = `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=d731edca152ef707766b1bf7bf0763e9&with_region=US`;
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
    console.log(data);
    })
    .catch(err => console.error(err));
}
function getMovieApi(genreId, page, genre){
    movieList.textContent = "";
    var requestUrl = `https://api.themoviedb.org/3/discover/movie?api_key=d731edca152ef707766b1bf7bf0763e9&with_original_language=en&with_genres=${genreId}&page=${page}&sort_by=vote_average.desc&vote_count.gte=200`;
    fetch(requestUrl)
    .then(function (response) {
        return response.json();
        })
    .then(function (data) {
    console.log(data);
    addTitle(genre);


    for(let i=0; i<data.results.length; i++){
        let movieBox = document.createElement("div");
        let title = document.createElement("h1");
        let movie = document.createElement("p");
        let poster = document.createElement("img");
        let poster_path = "";
        if(data.results[i].backdrop_path===null){
            poster_path = "assets/images/movie.png";
        }
        else{
            poster_path = "https://image.tmdb.org/t/p/original"+ data.results[i].backdrop_path;
        }
       
        title.textContent = data.results[i].original_title;
        movie.textContent = data.results[i].overview;
        poster.setAttribute("src", poster_path);
        poster.setAttribute("class", "media-left");
        title.setAttribute("class", "media-content");
        movie.setAttribute("class", "media-content");
        movieBox.setAttribute("class", "box content");
        movieBox.appendChild(poster);
        movieBox.appendChild(title);
        movieBox.appendChild(movie);
        movieList.appendChild(movieBox);
        getWatchProviders(data.results[i].id);

         
    }
    page = data.page
    setMovieStorage(page, genreId, genre);
    if(data.page===1){
        let pagination = document.createElement("nav");
        let next = document.createElement("a");
        pagination.setAttribute("class", "pagination is-rounded");
        next.setAttribute("class", "pagination-next");
        next.textContent = "Next";
        pagination.appendChild(next);
        movieList.appendChild(pagination);
        next.addEventListener("click", function(event){
            page++;
            event.preventDefault();
            getMovieApi(genreId, page, genre);
            setMovieStorage(page,genreId,genre);

        })
    } else{
        let pagination = document.createElement("nav");
        let previous = document.createElement("a");
        let next = document.createElement("a");
        pagination.setAttribute("class", "pagination is-rounded");
        previous.setAttribute("class", "pagination-previous");
        next.setAttribute("class", "pagination-next");
        previous.textContent = "Previous";
        next.textContent = "Next";
        pagination.appendChild(previous);
        pagination.appendChild(next);
        movieList.appendChild(pagination);
        next.addEventListener("click", function(event){
            page++;
            event.preventDefault();
            getMovieApi(genreId, page, genre);
            setMovieStorage(page,genreId,genre);
        })
        previous.addEventListener("click", function(event){
            page--;
            event.preventDefault();
            getMovieApi(genreId, page, genre);
            setMovieStorage(page,genreId,genre);
        })
        .catch(err => console.error(err));
    }
    

})
}
window.addEventListener("load", function () {
    movieList.textContent = "";
    let movieInfo = JSON.parse(localStorage.getItem("movieInfo"));
    addTitle(movieInfo[2]);
    getMovieApi(movieInfo[1],movieInfo[0], movieInfo[2]);
    

})
