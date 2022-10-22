import React from "react";
import styled from "styled-components";

const StylePagination = styled.div`
  .active button {
    background: linear-gradient(-45deg, rgba(255,255,255,0.22), rgba(0,0,0,0.25));
    box-shadow: 
    12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
  }
  .disabled button {
    color: lightgray;
    background: linear-gradient(-45deg, rgba(255,255,255,0.22), rgba(0,0,0,0.25));
  }
  button {
    color: #fff;
  }
  
`
export default function Pagination( data ) {

    const PaginationItems = (name, i) => {

        const handlePaginationNumber = () => {
            const num = Number(name.url.charAt(name.url.length-1))
            data.setPageNumber(num)
        
            if(name.label !== 'pagination.previous' && name.label !== 'pagination.next') {
                const num = Number(name.label)
                data.setPageNumber(num)
            }
        }   

        return (
           <StylePagination key={i}>
               {name.label === 'pagination.previous' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.previous' && name.url === null) && 'disabled'}`}>
                <button onClick={handlePaginationNumber} className={`icon-status page-link border-0 m-1 shadow-sm`} tabIndex="-1" style={{ zIndex: '1' }}>Previous</button>
                </li>}
                {(name.label  !== 'pagination.next' && name.label !== 'pagination.previous') && 
                <li className={`page-item ${name.active && 'active'}`}>
                    <button onClick={handlePaginationNumber} style={{ zIndex: '1' }} className="icon-status page-link shadow-sm border-0 m-1">
                        {name.label}
                    </button>
                </li>
                }
                {name.label === 'pagination.next' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.next' && name.url === null) && 'disabled'}`}>
                <button onClick={handlePaginationNumber} className="icon-status page-link border-0 shadow-sm m-1" tabIndex="-1" style={{ zIndex: '1' }}>Next</button>
                </li>}              
           </StylePagination>
        )
    }
    return (
          <>
           <nav aria-label="History page navigation">
            <ul className="pagination d-flex justify-content-center " >
                {data.data.links.map(PaginationItems)}
                </ul>
           </nav>            
          </>
    )
}