/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const navigate = useNavigate();
  let isThereDimensions= false
  if(window.localStorage.getItem('gabaryty')){
    isThereDimensions=true
  }
  return (
    <div onClick={() => navigate('/cennik')} className="vh-100 text-center">
      
      <p className='position-absolute top-50 start-50 translate-middle btn' >Witam, kliknij gdziekolwiek by przejść dalej</p>
      {isThereDimensions? <p>Masz zapisany cennik </p> : ''}
    </div>
  );
};

export default WelcomePage;
