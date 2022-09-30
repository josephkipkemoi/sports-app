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
           <React.Fragment key={i}>
               {name.label === 'pagination.previous' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.previous' && name.url === null) && 'disabled'}`}>
                <button onClick={handlePaginationNumber} className="page-link" tabIndex="-1">Previous</button>
                </li>}
                {(name.label  !== 'pagination.next' && name.label !== 'pagination.previous') && 
                <li className={`page-item ${name.active && 'active'}`}><button onClick={handlePaginationNumber} className="page-link">{name.label}</button></li>
                }
                {name.label === 'pagination.next' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.next' && name.url === null) && 'disabled'}`}>
                <button onClick={handlePaginationNumber} className="page-link" tabIndex="-1">Next</button>
                </li>}
              
           </React.Fragment>
        )
    }
    return (
          <>
           <nav aria-label="History page navigation" >
            <ul className="pagination d-flex justify-content-center" >
                {data.data.links.map(PaginationItems)}
                </ul>
           </nav>            
          </>
    )
}