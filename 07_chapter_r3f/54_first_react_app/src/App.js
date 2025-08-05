import './style.css'
import Clicker from './Clicker.js'
import People from './People.js';

// NOTE: Hooks
// useMemo: 計算結果をメモ化（キャッシュ)。重い計算や処理を毎回実行するのではなく、依存関係に変化がない限り前回の結果を再利用する。
import { useState, useMemo } from 'react';

//NOTE: The colors array is used to assign different colors to each Clicker component
// Appコンポーネントが更新されても、Clickerコンポーネントの色が変わらないようにするために、クラス外で定義
const colorsOutside = [
  `hsl(${Math.random() * 360}deg, 100%, 70%)`,
  `hsl(${Math.random() * 360}deg, 100%, 70%)`
]

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


  // NOTE: useMemo is used to memoize the colors array so that it is only recalculated when clickersCount changes
  // colorsOutsideはクラス外で定義されているが、useMemoを使うことで、Appコンポーネントが更新されても色が変わらないようにすることも可能
  const colors = useMemo(() =>
  {
    const colors = [];
    for (let i = 0; i < clickersCount; i++) {
      colors.push(`hsl(${Math.random() * 360}deg, 100%, 70%)`);
    }
    return colors;
  }, [clickersCount]);



  return (
    <>
      { children }

      <People />

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
            color={ colors[index]}/>
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