const API_URL = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc8926c48fae2c98be5d3ab644524fd4&page=1"
const IMG_PATH = "https://image.tmdb.org/t/p/w500"
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?&api_key=fc8926c48fae2c98be5d3ab644524fd4&query="'
const GENRE_URL = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=fc8926c48fae2c98be5d3ab644524fd4'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

const genres = [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]
const tagsEl = document.getElementById('tags')

let selectedGenre = []
// Get the genre
setGenre();
function setGenre() {
    tagsEl.innerHTML = '';

    genres.forEach(genre => {
        const t = document.createElement('div')
        t.classList.add('tag')
        t.id = genre.id
        t.innerText = genre.name
        t.addEventListener('click', () => {
            if (selectedGenre.length == 0) {
                selectedGenre.push(genre.id)
            } else {
                if (selectedGenre.includes(genre.id)) {
                    selectedGenre.forEach((id, idx) => {
                        if (id == genre.id) {
                            selectedGenre.splice(idx, 1)
                        }
                    })
                } else {
                    selectedGenre.push(genre.id)
                }
            }
            getMovies(GENRE_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            activeTag()
        })
        tagsEl.append(t)

    })
}


function activeTag() {
    const tags = document.querySelectorAll('.tag')
    tags.forEach(tag => {
        tag.classList.remove('active-tag')
    })
    clearBtn()
    if (selectedGenre.length != 0) {
        selectedGenre.forEach(id => {
            const selectedTag = document.getElementById(id)
            selectedTag.classList.add('active-tag')
        })
    }

}

function clearBtn() {
    let clearBtn = document.getElementById('clear')
    if (clearBtn) {
        clear.classList.add('clear-btn')
    } else {
        let clear = document.createElement('div')
        clear.classList.add('tag', 'clear-btn')
        clear.id = "clear"
        clear.innerText = "Clear All"
        clear.addEventListener('click', () => {
            selectedGenre = []
            setGenre()
            getMovies(API_URL)
        })
        tagsEl.append(clear)
    }

}

// Get initial movies
getMovies(API_URL)

async function getMovies(url) {
    const res = await fetch(url)
    const data = await res.json()

    if (data.results.length != 0) {
        showMovies(data.results)
    } else {
        main.innerHTML = `<h1 class="no-results">No Results <i class="fas fa-sad-tear no-result-icon"></i></h1>`
    }
}

function showMovies(movies) {
    main.innerHTML = ''

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie

        const movieEl = document.createElement('div')
        movieEl.classList.add('movie')

        movieEl.innerHTML = `
        <img src="${poster_path ? IMG_PATH + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">

        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getClassByRate(vote_average)}">${vote_average} <i class="fas fa-star"></i></span>
        </div>

        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>`

        main.appendChild(movieEl)
    })
}

function getClassByRate(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return 'orange'
    } else {
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value
    selectedGenre = []
    setGenre()
    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm)

        search.value = ''
    } else {
        window.location.reload()
    }
})

