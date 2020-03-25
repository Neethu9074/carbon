import React from 'react';

import locals from './SubViewSectionHeader.mless';

export default function SubViewSectionHeader({ children }) {
  return <h2 className={locals.header}>{children}</h2>;
}
