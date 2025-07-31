import { useState, useEffect } from 'react';

// export default function Clicker(props)
export default function Clicker( { increment, keyName, color = "darkOrchid"} )
{
  //NOTE: props is an object that contains all the properties passed to this component
  // const keyName = props.keyName;
  // console.log('Clicker component created', keyName);


  // const countState = useState(0);
  // const count = countState[0];
  // const setCount = countState[1];
  // or
  const [count, setCount] = useState(parseInt(localStorage.getItem(keyName) ?? 0));


  useEffect(() => {
    // console.log('first render');
    // console.log('first count', count);

    return () => {
      // console.log('dispose clicker component');
      localStorage.removeItem(keyName);
      // console.log('cleanup count', count);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(keyName, count);
  }, [count]);


  const buttonClick = () => {

    // window.setTimeout(() => {
    // }, 0);

    setCount(count + 1);
    // console.log('update count', count);
    // setCount(value => value + 1);

    increment()
  }


  return <div>
    <div style={ { color } }>Clicks count : {count}</div>
    <button onClick={ buttonClick }>Click me!</button>
  </div>
}