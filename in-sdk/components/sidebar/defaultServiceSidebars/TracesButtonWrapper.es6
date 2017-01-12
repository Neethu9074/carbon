import React from 'react';

import './TracesButtonWrapper.less';

const block = 'in-jump-to-traces-buttons';

export default function TracesButtonWrapper({children}) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
