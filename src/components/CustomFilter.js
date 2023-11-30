import React, {useState} from "react";
import styled from "styled-components";
import  Spinner  from "react-bootstrap/Spinner";
import axios from "../lib/axios";
import GameComponent from './GameComponent';
import  { 
  faSoccerBall,
  faBars,
  faRefresh,
  faPrint,
  faSearch,
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
`

const StyleCustomFilter = styled.div`
padding: .7rem;
background: #191970;
position: static;

.custom-filter {
  margin-left: .5rem;
  margin-right: .5rem;
}
 .icon {
  background: linear-gradient(-45deg, rgba(0,0,0,0.22), rgba(255,255,255,0.25));
  padding: .75rem;
  box-shadow: 
  2px 2px 3px 0 rgba(0, 0, 0, 0.25),
  -1px -1px 2px 0 rgba(255, 255, 255, 0.3);
  border-radius: 8px;
 }
`
export default function CustomFilter({ displayMode }) {
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
        <StyleCustomFilter className={` ${displayMode === 'dark-mode' && 'bg-dark'}`}>
          <div className={`d-flex align-items-center justify-content-between custom-filter`}>
              <FontAwesomeIcon className=" text-white icon" icon={faSoccerBall} size="lg"/>
              <FontAwesomeIcon icon={faPrint} className="text-white icon" size="lg"/>
              <FontAwesomeIcon icon={faRefresh} className="text-white icon" size="lg"/>
              <SearchComponent 
                onsubmit={onsubmit} 
                onchange={onchange} 
                customClass="search-comp"
              />  
              <FontAwesomeIcon 
                icon={faBars} 
                className="text-white icon" 
                size="lg" 
                style={{ marginLeft: 8 }}
                onClick={() => ''}
              /> 
          </div>
        </StyleCustomFilter>
    
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
            {/* <button id="searchBtn" className='btn d-flex align-items-center border-0' onClick={onsubmit}>        
              <i className="bi bi-search" style={{ color: '#ffffff' }}></i>
            </button> */}
            <FontAwesomeIcon icon={faSearch} className="text-white icon" size="lg"/>
      </div>
         
    </StyleSearch>
  )
}

const SearchResults = ({ data }) => {

    return (
      <>
         {/* <GameComponent data={data}/> */}
      </>
    )
  }
  