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
import MobileNavComponent from '../components/MobileNavComponent';

const ThemedBody = styled('div')`
 background-color: #424242;

 button {
  color: ${props => props.theme.colors.h5Color};
 }
`

const StyleGameData = styled('div')`
height: 100vh;
.custom-grid-box-main, .custom-grid-hide {
  background: #424242;
  color: #c3c3c3; 
}
.header {
  background: #424242;
  color: #ffffff;
  letter-spacing: 1px;
  font-weight: 600;
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
  .custom-grid h5 {
    font-size: 12px;
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
max-height: 100vh;
overflow-y: scroll;
overflow-x: hidden;

`

function App({ soccer_data }) {

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
                  <Col lg={9} md={12} sm={12} style={{ paddingRight: 0 }}>
                   <StyledMain>
                   <TopNavBar/>

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

                      <GameComponent data={soccer_data}/>

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
  const  data  = await axios.get('api/custom_fixture')
   
   return {
    props: {
      soccer_data: data.data.fixtures
    },  
  }
}

export default App;