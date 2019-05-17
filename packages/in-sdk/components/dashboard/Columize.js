import React from 'react';

import locals from './Columize.mless';

export default function Columize({ children }) {
  return <div className={locals.columize}>{children}</div>;
}
