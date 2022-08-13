import React, {useState} from "react";
import styled from "styled-components";
import  Row  from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import  Spinner  from "react-bootstrap/Spinner";
import axios from "../lib/axios";
import { Small } from "./Html";
import GameComponent from './GameComponent';

const StyleSearch = styled.div`
 background: none;
 border: none;
 margin-left: -5px;
 max-width: 220px;
 max-height: 32px;
 input[type=search] {
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  height: 100%;
  padding: 1rem;
 }
 button {
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
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
        <Col >
          <h5 className='text-white fw-bold' style={{ letterSpacing: 1, margin: 0 }}>{heading}</h5>
        </Col>
        <Col className="d-flex justify-content-center">
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
        <Col className='d-flex justify-content-end'>       
          <StyleSearch className='d-flex'>
            <input 
            type="search" 
            placeholder="Search" 
            className="form-control text-white"
            onChange={onchange}
            style={{ background: '#424242', borderRight: 'none', borderColor: '#198754' }}
            aria-label="Search"
            />
            <button className='btn btn-success d-flex align-items-center p-1' onClick={onsubmit}>        
              <i className="bi bi-search" style={{ marginLeft: 3, marginRight: 5, color: '#ffffff' }}></i>
            </button>
          </StyleSearch>       
        </Col>
      </Row>  
  
       {isSearchLoading ? <Spinner animation='grow' /> :  <SearchResults data={searchResults}/>}
  
      </>
       
    )
}

const SearchResults = ({ data }) => {

    return (
      <>
         <GameComponent data={data}/>
      </>
    )
  }
  