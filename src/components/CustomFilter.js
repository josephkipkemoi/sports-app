import React, {useState} from "react";
import styled from "styled-components";
import  Row  from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import  Spinner  from "react-bootstrap/Spinner";
import axios from "../lib/axios";
import { Small } from "./Html";
import GameComponent from './GameComponent';

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
 
@media screen and (max-width: 990px) {
  .search-comp {
      display: none !important;
  } 
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
@media screen and (max-width: 990px) {
  display: grid;
  grid-template-columns: 1fr 1fr ;
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
       <Row className="d-flex flex-row align-items-center p-2 card shadow-sm mb-2" style={{ backgroundColor: '#424242' }}>
        <StyleCustomFilter className="row">
          <Col lg={4} >
            <h5 className='text-white fw-bold' style={{ letterSpacing: 1, margin: 0 }}>{heading}</h5>
          </Col>
          <Col lg={4} className="d-flex justify-content-center">
            <StyleButton className='d-flex align-items-center'>
            <button className='btn' onClick={() => window.print()}>
              <i className="bi bi-printer"  style={{ color: '#ffffff' }}></i>
            </button>        
            <button className='background-none'>
              <i className="bi bi-arrow-clockwise p-1" style={{ color: '#ffffff' }}></i>
              <small style={{ color: '#ffffff', letterSpacing: '1px' }}>Refresh</small>
            </button>
            </StyleButton>      
          </Col>
          <Col lg={4} className='d-flex justify-content-end'>    
              <SearchComponent 
              onsubmit={onsubmit} 
              onchange={onchange} 
              customClass="search-comp"
              />    
          </Col>
        </StyleCustomFilter>
      </Row>  
  
       {isSearchLoading ? <Spinner animation='grow' /> :  <SearchResults data={searchResults}/>}
  
      </>
       
    )
}

export const SearchComponent = ({ onsubmit, onchange, customClass }) => {
  return (
    <StyleSearch >
      <div className={`d-flex ${customClass}`}>
      <input 
            type="search" 
            placeholder="Search" 
            className="form-control text-white"
            onChange={onchange}
            style={{ background: '#424242', borderRight: 'none', borderColor: '#198754' }}
            aria-label="Search"
            id="searchInpt"
            />
            <button id="searchBtn" className='btn btn-success d-flex align-items-center p-1' onClick={onsubmit}>        
              <i className="bi bi-search" style={{ marginLeft: 3, marginRight: 5, color: '#ffffff' }}></i>
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
  