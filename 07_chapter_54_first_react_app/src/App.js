import './style.css'

export default function App() {
  const subStyle = {
    color: 'blue',
    fontSize: '30px',
  };

  return (
    <>
      <h1>My First React App</h1>

      <h2 style={subStyle}>
        {subStyle.color} {subStyle.fontSize}
      </h2>

      <h3 className='cute-paragraph'>
      paragraph class style
      </h3>
    </>
  );
}