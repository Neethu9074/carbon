import React from 'react';

import './SubViewWrapper.less';

const block = 'in-config-view-sub-view-wrapper';

export default function SubViewWrapper({children}) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
