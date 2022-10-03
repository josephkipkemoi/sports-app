import React from "react";

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
           <div key={i}>
               {name.label === 'pagination.previous' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.previous' && name.url === null) && 'disabled'}`}>
                <button onClick={handlePaginationNumber} className="page-link border-0 m-1 shadow-sm" tabIndex="-1" style={{ zIndex: '1' }}>Previous</button>
                </li>}
                {(name.label  !== 'pagination.next' && name.label !== 'pagination.previous') && 
                <li className={`page-item ${name.active && 'active'}`}><button onClick={handlePaginationNumber} style={{ zIndex: '1' }} className="page-link shadow-sm border-0 m-1">{name.label}</button></li>
                }
                {name.label === 'pagination.next' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.next' && name.url === null) && 'disabled'}`}>
                <button onClick={handlePaginationNumber} className="page-link border-0 shadow-sm m-1" tabIndex="-1" style={{ zIndex: '1' }}>Next</button>
                </li>}              
           </div>
        )
    }
    return (
          <>
           <nav aria-label="History page navigation">
            <ul className="pagination d-flex justify-content-center" >
                {data.data.links.map(PaginationItems)}
                </ul>
           </nav>            
          </>
    )
}