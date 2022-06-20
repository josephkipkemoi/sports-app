import { useRouter } from 'next/router';
import React from 'react';

const History = () => {
    const router = useRouter();

    const { pid } = router.query

  const checkDate = (e) => {
    
  }
    return (
        <div style={{ backgroundColor: '#fff', height: '100vh' }}>
            <h1>All</h1>
            <input type="date" onChange={checkDate}/>
        </div>
    )
}

export default History;