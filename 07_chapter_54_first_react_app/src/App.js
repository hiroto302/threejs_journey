import './style.css'
import Clicker from './Clicker.js'
import { useState } from 'react';

export default function App( { clickersCount, children}) {
  const subStyle = {
    color: 'blue',
    fontSize: '30px',
  };

  const [hasClicker, setHasClicker] = useState(true);
  const [count, setCount] = useState(0);

  const toggleClickerClick = () => {
    setHasClicker(!hasClicker);
  }

  const increment = () => {
    setCount(count + 1);
  }

  // NOTE: Using Array constructor to create an array of a specific length
  // const tempArray = [...Array(clickersCount)];
  // console.log(tempArray)
  // tempArray.map((value, index) => {
  //   console.log('tempArray', index, value);
  // })


  return (
    <>
      { children }

      <div>Total count: { count }</div>

      <button onClick={toggleClickerClick}>{ hasClicker ? 'Hide':'Show'} Clicker</button>
      <h4>Clickers</h4>

      {/* { hasClicker ? <Clicker /> : null} */}
      { hasClicker && <>
        {/* <Clicker increment={ increment } keyName="countA" color="crimson"/>
        <Clicker increment={ increment } keyName="countB"/>
        <Clicker increment={ increment } keyName="countC" color={ `hsl(${Math.random() * 360}deg, 100%, 70%)`}/> */}

        { [...Array(clickersCount) ].map((value, index) =>
          <Clicker
            //NOTE: key is used to identify each component in the list
            // Each child in a list should have a unique "key" prop. このエラー対策
            key={index}
            increment={ increment }
            keyName={`count${index}`}
            color={ `hsl(${Math.random() * 360}deg, 100%, 70%)`}/>
        )}
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