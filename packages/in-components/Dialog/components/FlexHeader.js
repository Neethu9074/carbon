import React from 'react';

import locals from './FlexHeader.mless';

export default function FlexHeader({ children }) {
  return <div className={locals.header}>{children}</div>;
}
