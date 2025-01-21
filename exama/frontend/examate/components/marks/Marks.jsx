import React, { useState, useEffect } from 'react';
import './marks.css'

function Marks(props) {
  const [shouldGlow, setShouldGlow] = useState(false);

  useEffect(() => {
    setShouldGlow(true);
    const timeoutId = setTimeout(() => {
      setShouldGlow(false);
    }, 1000);

    
    return () => clearTimeout(timeoutId);
  }, [props.accountBalance]);

  const cardStyle = {
    width: '15rem',
    height: '4rem',
    boxShadow: shouldGlow ? `0 0 10px 5px ${props.glowColor}` : 'none',
    transition: 'box-shadow 0.4s ease-in-out',
  };


  return (
    <div className={`card mr-3`} style={{ ...cardStyle,backgroundColor:'#20a822',marginLeft: '10%' }}>
  <div className="card-body">
    <h5 className="card-title text-center" style={{ color: 'white' }}>Marks: 50</h5>
  </div>
</div>

  );
}

export default Marks;
