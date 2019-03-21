import React from 'react';

import locals from './Capitalize.mless';

export default function Capitalize({ children }) {
  return <span className={locals.wrapper}>{children}</span>;
}
