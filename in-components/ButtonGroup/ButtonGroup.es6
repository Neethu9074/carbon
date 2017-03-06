import React from 'react';

import './ButtonGroup.less';

const block = 'in-button-group';

export default function ButtonGroup({children}) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
