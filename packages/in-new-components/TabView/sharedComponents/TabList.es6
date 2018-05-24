import React from 'react';

import locals from './TabList.mless';

export default function TabList({ children }) {
  return (
    <ul className={locals.tabList}>
      {children}
      <li className={locals.emptyEnddingTab} />
    </ul>
  );
}
