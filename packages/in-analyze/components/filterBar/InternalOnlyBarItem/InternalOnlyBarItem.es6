import React from 'react';

import locals from './InternalOnlyBarItem.mless';

export default function InternalOnlyBarItem() {
  return <span className={locals.internalOnly}>Only internally visible</span>;
}
