import React from 'react';

import locals from './ButtonGroup.mless';

export default function ButtonGroup({ children }) {
  return (
    <div className={locals.group} role="group">
      {children}
    </div>
  );
}
