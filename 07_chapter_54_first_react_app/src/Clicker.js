import { useState, useEffect } from 'react';

export default function Clicker()
{
  // const countState = useState(0);
  // const count = countState[0];
  // const setCount = countState[1];
  // or
  const [count, setCount] = useState(parseInt(localStorage.getItem('count') ?? 0));


  useEffect(() => {
    // console.log('first render');
    // console.log('first count', count);
  }, []);

  useEffect(() => {
    localStorage.setItem('count', count);
  }, [count]);


  const buttonClick = () => {

    // window.setTimeout(() => {
    // }, 0);

    setCount(count + 1);
    // console.log('update count', count);
    // setCount(value => value + 1);
  }


  return <div>
    <h2>Clicker</h2>
    <div>Clicks count : {count}</div>
    <button onClick={ buttonClick }>Click me!</button>
  </div>
}