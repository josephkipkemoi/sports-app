import React from "react";

export default function Pagination( data ) {

    const PaginationItems = (name, i) => {
        return (
           <React.Fragment key={i}>
               {name.label === 'pagination.previous' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.previous' && name.url === null) && 'disabled'}`}>
                <a className="page-link" href="#" tabIndex="-1">Previous</a>
                </li>}
                {(name.label  !== 'pagination.next' && name.label !== 'pagination.previous') && 
                <li className={`page-item ${name.active && 'active'}`}><a className="page-link" href="#">{name.label}</a></li>
                }
                {name.label === 'pagination.next' 
                && <li className={`page-item ${name.active && 'active'} ${(name.label === 'pagination.next' && name.url === null) && 'disabled'}`}>
                <a className="page-link" href="#" tabIndex="-1">Next</a>
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