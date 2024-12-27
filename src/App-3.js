import { useEffect, useState } from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "fb1e0929";
  


export default function App() {

  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
 
  const [isOpen2, setIsOpen2] = useState(true);

  // const tempQuery = "interstellar";

  function handleSelectMovie(id) {
    setSelectedId((selectedId)=>id===selectedId ?null : id);
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
 
  function handleAddWatched(movie) {
    setWatched([...watched,movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }



  useEffect(() => {

     //to avoid the race condition
      const controller = new AbortController();
      
    async function fetchMovies() {

     
      try {
        setIsLoading(true);
        //resetting error 
        setError('');
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${KEY}`,{signal:controller.signal});
       
        if (!response.ok) {
          //for errors like network errror
          throw new Error("something went wrong with fetching movies")
        }
        const data = await response.json();

        if (data.Response === 'False') {
          //for wrong query error
          throw new Error("Movie not Found");
        }
        setMovies(data.Search)
        console.log(data);
        setError("");
      }
      catch (err) {
        console.error(err); 
        //here message is inbuilt message property
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      }
      finally{
         setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }
    handleCloseMovie();
    fetchMovies();

    //clean function for race condition
    return function () {
      controller.abort()
    }
  }, [query]);

  return (
    <>
      
      <NavBar>
       <Search query={query} setQuery={setQuery}/>
       <NumResults movies={movies}/>
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ?<Loader/> :<MovieList movies={movies} />} */}
          {/* mutually exclusive conditions */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList
            movies={movies}
            onSelectMovie={handleSelectMovie}
            />}
          {error && <ErrorMessage message={error}/>}
          
      </Box>
        <Box>{selectedId ? (
          <MovieDetails selectedId={selectedId}
            onCloseMovie={handleCloseMovie}
            onAddWatched={handleAddWatched}
            watched={watched} />) : (
          <>
          <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched}
                onDeleteWatched={handleDeleteWatched} />
          </> )
        }
     </Box>
      </Main>
      
    </>
  );
}

function Loader() {
  return (
    <div>
      <p className="loader">
        Loading...
      </p>
    </div>
  )
}
function ErrorMessage({message}) {
  return (
    <p className="error">
      ❌{message}
    </p>
  )
}

//strectural componenet
function NavBar({children}) {
 
  return(
    <nav className="nav-bar">
      <Logo/>
      {children}
    </nav>
  )
}

//presenatational component
function Logo() {
  return (
     <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
  )
}

//statefull component
function Search({query,setQuery}){

  return (
    <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
  )
}
//presentation
function NumResults({movies}) {
  return (
     <p className="num-results">
      Found <strong>{movies.length}</strong> results
      </p>
  )
}

//strectural componenet
function Main({children}) {

  return (
    <main className="main">
      {children}
    </main>
  )
}

//statefull
function Box({children}) {

 
  const [isOpen, setIsOpen] = useState(true);

  return (
            <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && (
            children
          )}
        </div>

  )
}


function MovieList({movies,onSelectMovie}) {

  return (
    <ul className="list list-movies">
              {movies?.map((movie) => (
                <Movie movie={movie} key={movie.imdbID}
                  onSelectMovie={onSelectMovie} />
              ))}
            </ul>
  )
}
//present or stateless
function Movie({movie,onSelectMovie}) {
  return (
    <li key={movie.imdbID} onClick={()=>onSelectMovie(movie.imdbID)}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
  )
}

function MovieDetails({ selectedId, onCloseMovie,onAddWatched,watched}) {
  
  const [movie, setMovie] = useState({});
  const [isloading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');

  const isWatched = watched.map((movie) => movie.imdbID)
    .includes(selectedId);
  // console.log(isWatched);

  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre } = movie;
  
  
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split('').at(0)),
      userRating,
    }
    onAddWatched(newWatchedMovie)
    onCloseMovie();
  }

  useEffect(() => {

    function callBack(e) {
      if (e.code ==="Escape") {
        onCloseMovie(); 
        console.log("close");
      }
    }

    document.addEventListener("keydown", callBack)
      
    return function () {
          document.removeEventListener("keydown",callBack)
        }
  }, [onCloseMovie]);

  useEffect(() => {


    async function getMovieDetails() {
      setIsLoading(true);
      const response = await fetch(`https://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`);
      const data = await response.json();
      setMovie(data);
      // console.log(data);
      setIsLoading(false);
      }
    getMovieDetails();
  }, [selectedId])
  
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;
    
    //clean up effect function to come back to original title 
    return function () {
      document.title = 'usePopcorn';
    }
  },[title])
  return (
   
    <div className="details">
      {isloading ? (<Loader />) : (
        <>
          <button
            onClick={onCloseMovie}
            className="btn-back">&larr;</button>
          <header>
            <img src={poster} alt={`poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                <StarRating maxRating={10}
              size={20}
              onSet={setUserRating}/>
                  {userRating > 0 &&(<button
                    className="btn-add"
                    onClick={handleAdd}>
                    +Add to list
                  </button>)}
                </>
              )
            :
                (<p>Already rated movie {watchedUserRating}</p>)}
              </div>
            <p>
              <em>{plot}</em>

            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  )
}

function WatchedSummary({ watched }) {
  
  
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating.toFixed(2)}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating.toFixed(2)}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
  )
}

function WatchedMoviesList({watched,onDeleteWatched}) {
  return (
    <ul className="list">
                {watched.map((movie) => (
                  <WatchedMovie movie={movie}
                    key={movie.imdbID}
                    onDeleteWatched={onDeleteWatched} />
                ))}
              </ul>
  )
}

function WatchedMovie({movie,onDeleteWatched}) {
  return (
    <li>
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>
        <button className="btn-delete"
        onClick={()=>onDeleteWatched(movie.imdbID)}>X</button>
                    </div>
                  </li>
  )
}
