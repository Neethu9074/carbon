import React from 'react';

import './ActiveSubView.less';

const block = 'in-config-view-active-view';

export default function ActiveSubView({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
