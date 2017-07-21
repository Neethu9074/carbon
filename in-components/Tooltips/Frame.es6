import React from 'react';

import './Frame.less';

const block = 'in-tooltip__frame';

export default function TooltipFrame({ children, anchor }) {
  // return null if there are no children available
  if (!children || children.length === 0) {
    return null;
  }

  anchor = anchor ? anchor : 'left';

  return (
    <div className={block + ' ' + block + '__' + anchor}>
      {children}
    </div>
  );
}
