import { useState } from 'react';

export default function Clicker()
{
  // const countState = useState(0);
  // const count = countState[0];
  // const setCount = countState[1];
  // or
  const [count, setCount] = useState(0);


  const buttonClick = () => {

    window.setTimeout(() => {
      console.log('Timeout');
      setCount(count + 1);
      // setCount(value => value + 1);
    }, 0);

    // console.log(countState);
  }


  return <div>
    <h2>Clicker</h2>
    <div>Clicks count : {count}</div>
    <button onClick={ buttonClick }>Click me!</button>
  </div>
}