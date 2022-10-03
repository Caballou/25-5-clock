import React from 'react';
import './App.css';
import { useState } from 'react';

function App() {

  const [time, setTime] = useState(25*60)
  const [breakLength, setBreaklength] = useState(5*60)
  const [sessionLength, setSessionLength] = useState(25*60)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionActive, setSessionActive] = useState(true)

  const display = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;

    if (time === 0){
      const audio = document.getElementById('beep')
      audio.play()
    }

    if (minutes < 0 && seconds < 0){
      setSessionActive(!sessionActive)
      if (sessionActive){
        setTime(breakLength) 
      } else {
        setTime(sessionLength)
      }
    }
    return ( (minutes < 10 ? '0' + minutes : minutes ) + ':' + (seconds < 10 ? '0' + seconds : seconds));
  }

  const changeTime = (val, type) => {
    if (!isRunning){
      if (type === 'break'){
        if ( (breakLength <= 60 && val < 0) || (breakLength >= 60*60 && val > 0)){ /*No permite setear el break en
         valores menores a 1 ni mayores a 60*/
          return;
        }
        setBreaklength(breakLength + val) /*Cambia la duración del break*/
        if (!sessionActive){
          setTime(breakLength + val) /*Si se está en break se puede cambiar el valor que se muestra en pantalla*/
        }
      } else if (type === 'session'){
        if ( (sessionLength <= 60 && val < 0) || (sessionLength >= 60*60 && val > 0) ){ /*No permite setear la sesión en
        valores menores a 1 ni mayores a 60*/
          return;
        }
        setSessionLength(sessionLength + val) /*Cambia la duración de la sesión*/
        if (sessionActive){
          setTime(sessionLength + val) /*Si se está en Session se puede cambiar el valor que se muestra en pantalla*/
        }
      }
    }
  }

  const playPause = () => {
    let second = 1000; 
    let date = new Date().getTime(); 
    let nextDate = new Date().getTime() + second; 

    if (!isRunning) {
      let interval = setInterval( () => {
        date = new Date().getTime();
        if (date > nextDate) {
          setTime((prev) => {
            return prev - 1; 
          });
          nextDate += second; 
        }
      }, 1000);

      localStorage.clear()
      localStorage.setItem('interval-id', interval)

    } else {
      clearInterval(localStorage.getItem('interval-id'))
    }
    
    setIsRunning(!isRunning)
  }

  const reset = () => {
    const audio = document.getElementById('beep')
    audio.pause()
    audio.currentTime = 0;
    clearInterval(localStorage.getItem('interval-id'))
    setSessionActive(true)
    setTime(25*60)
    setBreaklength(5*60)
    setSessionLength(25*60)
    setIsRunning(false)
  }

  return (
    <div className={`App ${sessionActive ? 'session' : 'break'}`}>

      <div className='titulo'>
      <img src='tomate.png' alt='Tomate Img'></img>
      <h1>25 + 5 Clock</h1>
        <img src='tomate.png' alt='Tomate Img'></img>
      </div>
      
      <div className='contenedor-principal'>
        
        
        <div className='length-div'>

          <div className='break-div'>
            <label id='break-label'>Break Length</label>
              <div className='break-buttons-div'>

                <button id='break-decrement' className={`arrow-button ${sessionActive ? 'session-button' : 'break-button'}`}
                onClick={() => changeTime(-60,'break')}>
                  <i class="fa-solid fa-arrow-down"></i>
                </button>

                <p id='break-length'>{breakLength / 60}</p>

                <button id='break-increment' className={`arrow-button ${sessionActive ? 'session-button' : 'break-button'}`}
                onClick={() => changeTime(+60,'break')}>
                  <i class="fa-solid fa-arrow-up"></i>
                </button>

              </div>
          </div>

          <div className='session-div'>
            <label id='session-label'>Session Length</label>
            <div className='session-buttons-div'>

              <button id='session-decrement' className={`arrow-button ${sessionActive ? 'session-button' : 'break-button'}`}
              onClick={ () => changeTime(-60,'session') }>
                <i class="fa-solid fa-arrow-down"></i>
              </button>

              <p id='session-length'>{sessionLength / 60}</p>

              <button id='session-increment' className={`arrow-button ${sessionActive ? 'session-button' : 'break-button'}`}
              onClick={ () => changeTime(+60,'session') }>
                <i class="fa-solid fa-arrow-up"></i>
              </button>

            </div>
          </div>

        </div>

        <div className='timer-play-div'>

          {sessionActive ? ( 
            <div className='timer-div'>
              <label id='timer-label'>Session</label>
              <div id='time-left'>{display(time)}</div>
            </div>
          ) : (
            <div className='timer-div'>
              <label id='timer-label'>Break</label>
              <div id='time-left'>{display(time)}</div>
            </div>
          )
          }

          <div className='play-div'>
          {!isRunning ? 
            <button className={`control-button ${sessionActive ? 'session-button' : 'break-button'}`} id='start_stop' type='play' onClick={() => {
            setIsRunning(true)
            playPause()}}><i class="fa-solid fa-play"></i></button>
            :
            <button className={`control-button ${sessionActive ? 'session-button' : 'break-button'}`} id='start_stop' type='pause' onClick={() => {
            setIsRunning(false)
            playPause()}}><i class="fa-solid fa-pause"></i></button>
          }
          
          <button className={`control-button ${sessionActive ? 'session-button' : 'break-button'}`} id='reset' type='reset' onClick={reset}>
            <i class="fa-solid fa-arrows-rotate"></i>
          </button>
          
          <audio id='beep' 
            preload='auto' 
            src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'>
          </audio>
            
          </div>
        </div>
      </div>
      <div className='firma'>by Caballou 🐴</div>
    </div>
  );
}

export default App;
