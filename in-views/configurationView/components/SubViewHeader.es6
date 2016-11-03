import React from 'react';

import './SubViewHeader.less';

const block = 'in-config-view-sub-view-header';

export default function SubViewHeader({children}) {
  return (
    <h1 className={block}>
      {children}
    </h1>
  );
}
