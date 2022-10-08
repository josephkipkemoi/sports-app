import React, {useState} from "react";
import styled from "styled-components";
import  Spinner  from "react-bootstrap/Spinner";
import axios from "../lib/axios";
import GameComponent from './GameComponent';
import  { 
  faSoccerBall,
  faBars,
}  from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StyleSearch = styled.div`
input {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  height: 100%;
  padding: .5rem;
  margin-left: 5px;
}
button {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
}
 
@media screen and (min-width: 990px) {
  .custom-search {
    display: none !important;

  }
}
`
const StyleButton = styled.div`
button {
  background: none;
  border: none;
}
button:hover {
  color: #fff;
}
`

const StyleCustomFilter = styled.div`
display: flex;
align-items: center;
padding: 10px 15px;
background-color: #191970;
position: static;
.header-one {
  width: 40%;
}
.header-two {
  width: 40%;
}
.header-three {
  width: 20%;
}
@media screen and (max-width: 992px) {
  .header-one {
    width: 100%;
  }
  .header-two {
     display: none;
  }
  .header-three {
    width: 60px;
  }
}
 h5 {
  margin: 0;
  padding: 0;
  color: #fff;
  text-transform: uppercase;
 }

`
export default function CustomFilter({ heading }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearchLoading, setIsSearchLoading] = useState(false)
  
    const onchange = (e) => {
      setSearchTerm(e.target.value) 
    }
  
    const onsubmit = async () => {
      setIsSearchLoading(true)
      const res = await axios.get(`api/fixture/search?q=${searchTerm}`);
     
      if(res.status === 200) {
        setSearchResults(res.data.data)
        setIsSearchLoading(false)
      }
    }
    return (
      <>
      <div>
        <StyleCustomFilter >
          <div className="header-one d-flex align-items-center">
            <FontAwesomeIcon className="fa-lg text-white" icon={faSoccerBall} />
            <h5 className='fw-bold mx-auto'>{heading}</h5>
          </div>
          <div className="header-two">
            <StyleButton className='d-flex align-items-center'>
              <button className='btn' onClick={() => window.print()}>
                <i className="bi bi-printer"  style={{ color: '#ffffff' }}></i>
              </button>        
              <button className='background-none'>
                <i className="bi bi-arrow-clockwise p-1" style={{ color: '#ffffff' }}></i>
                <small style={{ color: '#ffffff', letterSpacing: '1px' }}>Refresh</small>
              </button>
            </StyleButton> 
          </div>
          <div className="d-flex align-items-center">
            <SearchComponent 
              onsubmit={onsubmit} 
              onchange={onchange} 
              customClass="search-comp"
            />  
            <FontAwesomeIcon icon={faBars} className="text-white" size="lg" style={{ marginLeft: 8 }}/> 
          </div>
        </StyleCustomFilter>
      </div>
    
       {isSearchLoading ? <Spinner animation='grow' /> :  <SearchResults data={searchResults}/>}
  
      </>
       
    )
}

export const SearchComponent = ({ onsubmit, onchange }) => {
  return (
    <StyleSearch >
      <div className={`d-flex`}>
      {/* <input 
            type="search" 
            placeholder="Search" 
            className="form-control text-white"
            onChange={onchange}
            style={{ background: '#424242', borderRight: 'none', borderColor: '#198754' }}
            aria-label="Search"
            id="searchInpt"
            /> */}
            <button id="searchBtn" className='btn d-flex align-items-center border-0' onClick={onsubmit}>        
              <i className="bi bi-search" style={{ color: '#ffffff' }}></i>
            </button>
      </div>
         
    </StyleSearch>
  )
}

const SearchResults = ({ data }) => {

    return (
      <>
         <GameComponent data={data}/>
      </>
    )
  }
  