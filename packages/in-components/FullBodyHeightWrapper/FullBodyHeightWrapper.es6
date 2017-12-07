import React from 'react';

import locals from './FullBodyHeightWrapper.mless';

export default function FullBodyHeightWrapper({ children }) {
  return <div className={locals.wrapper}>{children}</div>;
}
