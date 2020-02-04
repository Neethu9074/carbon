import React from 'react';

import locals from './FullViewWrapper.mless';

export default function FullViewWrapper({ children }) {
  return <div className={locals.fullViewWrapper}>{children}</div>;
}
