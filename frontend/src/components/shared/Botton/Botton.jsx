import React from 'react';
import style from './Botton.module.css';

const Botton = ({writeup, image, onClick,}) => {
  return (
    <button onClick={onClick} className={style.button}>
        <span>{writeup}</span>
        <img className={style.image} src={`/images/${image}.png` } alt="arow" />
    </button>
    
  );
};

export default Botton;