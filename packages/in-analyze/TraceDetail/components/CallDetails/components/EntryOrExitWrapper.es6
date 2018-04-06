import React from 'react';

import locals from './EntryOrExitWrapper.mless';

export default function EntryOrExitWrapper({ children, isCalled = false }) {
  return (
    <div>
      <h4 className={locals.title}>{isCalled ? 'Calling To' : 'Calling From'}</h4>
      {children}
    </div>
  );
}
