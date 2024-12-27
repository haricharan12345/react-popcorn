//here named exports is used
//It's better to use named exports for custom hooks
//here there are 3 useState and one useEffect hooks

import { useEffect, useState } from "react";
const KEY = "fb1e0929";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState("");

  
useEffect(() => {
     
    //  this is  handleCloseMovie(); function
    //  callBack?.()
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
 
    fetchMovies();

    //clean function for race condition
    return function () {
      controller.abort()
    }
  }, [query]);

    //return is importent step in hooks
    //here objects is returned
    return{movies,isLoading,error}
}