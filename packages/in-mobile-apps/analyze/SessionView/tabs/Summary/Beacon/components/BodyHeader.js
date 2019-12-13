import React from 'react';

import locals from './BodyHeader.mless';

export default function BodyHeader({ children }) {
  return <h2 className={locals.header}>{children}</h2>;
}
