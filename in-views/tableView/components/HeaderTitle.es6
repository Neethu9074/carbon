import React from 'react';

import './HeaderTitle.less';

const block = 'in-table-view-header-title';

export default function HeaderTitle({children}) {
  return (
    <h1 className={block}>
      {children}
    </h1>
  );
}
