import './style.css'
import Clicker from './Clicker.js'
import { useState } from 'react';

export default function App( { children}) {
  const subStyle = {
    color: 'blue',
    fontSize: '30px',
  };

  const [hasClicker, setHasClicker] = useState(true);

  const toggleClickerClick = () => {
    setHasClicker(!hasClicker);
  }


  return (
    <>
      { children }

      <button onClick={toggleClickerClick}>{ hasClicker ? 'Hide':'Show'} Clicker</button>
      <h4>Clickers</h4>

      {/* { hasClicker ? <Clicker /> : null} */}
      { hasClicker && <>
        <Clicker keyName="countA" color="crimson"/>
        <Clicker keyName="countB" color={ `hsl(${Math.random() * 360}deg, 100%, 70%)`}/>
        <Clicker keyName="countC"/>
      </> }

      <h2 style={subStyle}>
        {subStyle.color} {subStyle.fontSize}
      </h2>

      <h3 className='cute-paragraph'>
      paragraph class style
      </h3>
    </>
  );
}