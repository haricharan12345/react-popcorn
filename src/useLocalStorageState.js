import { useEffect, useState } from "react";

//here initialState is used when there localStoragre is empty
//it is an array 
export function useLocalStorageState(initialState, key) {
    //here key is just name of the localstorage key name 

 const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
     return storedValue ? JSON.parse(storedValue) :
         initialState;
 });
    useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
    }, [value, key]);
    
    return[value,setValue]
  
}