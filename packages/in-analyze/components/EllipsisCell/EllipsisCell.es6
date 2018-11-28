import React from 'react';

import locals from './EllipsisCell.mless';

export default function EllipsisCell({ children }) {
  return <div className={locals.shorten}>{children}</div>;
}
