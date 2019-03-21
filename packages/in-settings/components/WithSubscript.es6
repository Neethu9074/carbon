import React from 'react';

import locals from './WithSubscript.mless';

export default function WithSubscript({ subscript, children }) {
  return (
    <div className={locals.container}>
      {children}
      {subscript && <span className={locals.smallTextBelow}>{subscript} </span>}
    </div>
  );
}
