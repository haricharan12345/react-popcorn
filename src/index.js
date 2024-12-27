import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import StarRating from './StarRating';
import './index.css';
import App from './App';

// function Test() {
//   const [movieRating, setMovieRating] = useState(0)
  
//   return (
//     <div>
//       <StarRating color='blue' maxRating={4} onSet={setMovieRating} />
//       <p>This movie is rated {movieRating} rated</p>
//     </div>
//   )
// }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} />
    <StarRating maxRating={8} color='red' size={35}
      defaultRating={4} /> */}
    {/* <StarRating /> 
    <Test/> */}
  </React.StrictMode> 
);
