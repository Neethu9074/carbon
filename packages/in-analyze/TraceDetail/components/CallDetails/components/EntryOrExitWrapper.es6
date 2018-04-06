import React from 'react';

import locals from './EntryOrExitWrapper.mless';

export default function EntryOrExitWrapper({ children, isEntry = false }) {
  return (
    <div>
      <h4 className={locals.title}>{isEntry ? 'Calling To' : 'Calling From'}</h4>
      {children}
    </div>
  );
}
