import './style.css'
import Clicker from './Clicker.js'
import { useState } from 'react';

export default function App() {
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
      <button onClick={toggleClickerClick}>{ hasClicker ? 'Hide':'Show'} Clicker</button>

      {/* { hasClicker ? <Clicker /> : null} */}
      { hasClicker && <Clicker /> }

      <h2 style={subStyle}>
        {subStyle.color} {subStyle.fontSize}
      </h2>

      <h3 className='cute-paragraph'>
      paragraph class style
      </h3>
    </>
  );
}