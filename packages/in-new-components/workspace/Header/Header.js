import React from 'react';

import locals from './Header.mless';

export default function Header({ children }) {
  return <h2 className={locals.header}>{children}</h2>;
}
