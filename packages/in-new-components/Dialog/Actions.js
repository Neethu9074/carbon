import React from 'react';

import locals from './Actions.mless';

export default function Actions({ children }) {
  return <div className={locals.actions}>{children}</div>;
}
