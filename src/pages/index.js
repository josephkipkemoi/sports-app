import React, { useEffect } from 'react';
import axios from '../lib/axios';
import styled from 'styled-components';
import Row  from 'react-bootstrap/Row';
import Col  from 'react-bootstrap/Col';

import TopNavBar from '../components/TopNavBar';
import Support from '../components/Support';
import GameComponent from '../components/GameComponent';
import CustomerInfo from '../components/CustomerInfo';
import CustomFilter from '../components/CustomFilter';
import BetslipContainer  from '../components/BetslipContainer';
import Tooltip from '../components/Tooltip';
import { BottomNavBar } from '../components/NavBar';
import { useGetV1CustomFixtureQuery } from '../hooks/fixture';
import { Spinner } from 'react-bootstrap';
import CustomAds from '../components/CustomAds';

const ThemedBody = styled('div')`
 background-color: #424242;

 button {
  color: ${props => props.theme.colors.h5Color};
 }
`

const StyleGameData = styled('div')`
height: auto;
overflow-y: scroll;
overflow-x: hidden;
background-color: #ebeded;
 
.custom-grid-box-main, .custom-grid-hide {
  background: #ebeded;
  color: #191970; 
}
 
.header {
  background: #fff;
  color: #191970;
  letter-spacing: 1px;
  font-weight: 700;
  width: 90%;
 }
.custom-grid-box {
  background: #424242;
  text-align: center;
  border-top: 1px solid #636363;
}
.btn-custom {
  border: none;
  cursor: pointer;
  padding: 24px 12px;
  width: 100%;
  // background: #424242;
  transition: .3s ease-out;
}
.active-btn {
  background: ${props => props.theme.colors.headerColor};
}
.btn-custom:hover {
  background: ${props => props.theme.colors.headerColor};
}
 
@media screen and (max-width: 576px) {
  .custom-grid {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
  }
 
  .custom-grid-hide {
    display: none;
  }
 .custom-grid-box {
   max-width: 33%;
 }
`

const StyledMain = styled.div`
background: #424242;
`

function App({ data }) {
   
  useEffect(() => {

    const currentSession = sessionStorage.getItem('session_id')

    if(!!currentSession === false) {
      sessionStorage.setItem('session_id', Date.now())
    }  

  },[])
 
  return (
    <ThemedBody>
            <main>
              <Row className='px-2'>
                  <Col lg={9} md={12} sm={12} style={{ padding: 0 }}>
                   <StyledMain>
                   <TopNavBar/>
                   <CustomAds/>
                   <CustomFilter heading="Highlights"/>

                   <StyleGameData>
                 
                     <div style={{ position:  'relative' }}>
                      <Tooltip 
                        message="To view all available markets for each game Click here"
                        number={1}
                        top={0}
                        right={50}
                        caret_position="right"
                      /> 

                      <GameComponent data={data} />

                     </div>
                     
                   </StyleGameData>   
                   </StyledMain>  
                                                                                                                                      
                  </Col>
                  
                  <Col lg={3} md={12} sm={12} style={{ paddingLeft: 0 }}>    
                   
                    <BetslipContainer />
                    <CustomerInfo />

                  </Col>

              </Row>
            </main>
            
            <Support/>  

    </ThemedBody>
  );
}

export async function getServerSideProps(context) {
  const data = await axios.get('api/custom_fixture')

  return {
    props: {
      data: data.data.fixtures
    }, // will be passed to the page component as props
  }
}

export default App;