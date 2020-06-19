import React from 'react';

import locals from './HorizontalFlexWrapper.mless';

export default function HorizontalFlexWrapper({ children }) {
  return <div className={locals.wrapper}>{children}</div>;
}
