import React from 'react';

export default function Root({children}) {
  return (
    <div style={{margin: '1rem'}}>
      {children}
    </div>
  );
}
