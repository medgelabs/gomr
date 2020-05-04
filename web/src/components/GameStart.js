import React from 'react';
import axios from 'axios';


const GameStart = () => {

  axios.post('localhost:3000/game').then(success => {
    
  }).catch((fail) =>{
    console.log('could not create new game');
  });

  return <>
  
  </>
}