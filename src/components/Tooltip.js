
import React, {useState, useEffect} from "react"
import styled from "styled-components"
import Card  from "react-bootstrap/Card"

const StlyeTooltip = styled.div`
position: absolute;
background: #fff;
max-width: 240px;
z-index: 2;
letter-spacing: 2px;
button {
  letter-spacing: 1px;
}
.tool-message {
text-align: right;
}
.card-tooltip {
margin-top: 2px;
padding-top: 2px;
margin-bottom: 2px;
padding-bottom: 2px;
padding-left: 5px;
padding-right: 5px;
}
.caret-tooltip {
position: absolute;
}
.header-message {
margin-left: 5px;
}
.caret {
position: absolute;
right: 0;
top: 0;
margin-top: 29px;
margin-right: -12px;
}
`

export default function Tooltip ({ message, number, top, right, caret_position }) {
const [display, setDisplay] = useState('none')

const tooltips = document.getElementsByClassName('tool-tip')

const closeDisplay = () => {
setDisplay('none')
sessionStorage.setItem('tooltip', 'off');
}

const switchDisplay = () => {
  if(number === 1) {
    setDisplay('none')
  }
  tooltips[0].classList.remove('d-block')

  tooltips[1].classList.remove('d-none')
  tooltips[1].classList.add('d-block')
  
  if(number === 2) {
    tooltips[1].classList.add('d-none')
    setDisplay('none')
  }
}

useEffect(() => {
const toolTipStatus = sessionStorage.getItem('tooltip')

const timer = setTimeout(() => {
  number === 1 && setDisplay('block')
}, 3000)

toolTipStatus === 'off' && clearTimeout(timer)
return () => clearTimeout(timer)

}, [])

return (
<StlyeTooltip 
  className={`shadow-lg rounded d-${display} tool-tip tool-tip-1 p-1 bg-white`}
  style={{ top: `${top}px`, right: `${right}px` }}
  >
        <Card className='bg-white border-0'>
        <Card.Body className="card-tooltip tool-message">
          <small className='text-dark'>
            {message}
          </small>
        </Card.Body>
        <Card.Footer className="card-tooltip" style={{ padding: 0, margin: 0 }}>
          <div className='d-flex justify-content-between'>
            <button 
              className='d-flex align-items-center btn btn-secondary m-1 btn-sm text-white shadow-sm'
              onClick={closeDisplay}
            >
              <i className="bi bi-x-octagon-fill"></i>
              <small style={{ marginLeft: 5 }}>Hide tips</small> 
            </button>
            <button 
            className='btn btn-primary m-1 btn-sm text-white d-flex align-items-center shadow-sm'
            onClick={switchDisplay}
            >
              <small>Next</small>
              <i className="bi bi-caret-right-fill" style={{ marginRight: -5}}></i>
              <i className="bi bi-caret-right-fill"></i>
            </button>
          </div>  
        </Card.Footer> 
        </Card>
        <div className='caret'>
          <i className={`bi bi-caret-${caret_position}-fill text-white`}></i>
        </div>
    </StlyeTooltip>
)
}