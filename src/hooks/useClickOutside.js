import React from "react";

export default function useClickOutside(elRef, callback) {
    // Keep track of latest version of callback
    const latestCallback = React.useRef()
    latestCallback.current = callback
    // When the element ref changes, run our effect
    React.useEffect(() => {
    // Handle the document click event
    
    const handleClickOutside = e => {
      
        // if we are not tracking an element, stop       
        if(!elRef.current) {
            return 
        }

        // if element doesnt contain our click target, stop
        if(elRef.current.contains(e.target) || e.target.getAttribute('modalId') === 'modal-ref') {
            return
        }

        // if there is a callback, call it with the click event!
        if(latestCallback.current) {
            latestCallback.current(e)
        }
    }
     // Add listener to the document
     document.addEventListener('click', handleClickOutside, true)

     // Return cleanup function
     return () => {
         // Remobe listener from the document
         document.removeEventListener('click', handleClickOutside, true)
     }
  }, [elRef])
}