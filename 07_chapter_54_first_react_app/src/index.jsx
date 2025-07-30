import './style.css'
import App from './App.js'
import { createRoot } from 'react-dom/client'


const root = createRoot(document.querySelector('#root'))

const boolJSX = true
const stringJSX = 'Hello World'
const subStyle = "sub-style"

root.render(
    <>
        <h1 className='title' style={{'backgroundColor': 'floralwhite', 'color': 'coral'}}>
            Hello { `datetime is ${Date.now()}`} <br />
            { <em> {stringJSX} </em> } <br />
            Are you ok? { boolJSX ? 'Yes' : 'No' }
        </h1>
        <p>HELLO AGAIN <strong>WORLD</strong> <br />hello world <br /></p>
        <input type="checkbox" id="the-checkbox"/>
        <label htmlFor="the-checkbox">Check me!</label>

        <h2 style={{subStyle}}>
            { subStyle}
        </h2>

        <h3 className='cute-paragraph' style={{ color: 'red', fontSize: '20px' }}>
            color style
        </h3>

        <App />
    </>
)