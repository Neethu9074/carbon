import React from 'react';

import locals from './Frame.mless';

export default function Frame({ children }) {
  return <div className={locals.frame}>{children}</div>;
}
