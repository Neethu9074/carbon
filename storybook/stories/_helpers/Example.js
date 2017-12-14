import React from 'react';

export default function Example({children}) {
  return (
    <div style={{paddingLeft: '1rem', marginLeft: '1rem', borderLeft: '1px solid #563d7c'}}>
      {children}
    </div>
  );
}
