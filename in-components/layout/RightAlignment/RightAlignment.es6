import React from 'react';

import './RightAlignment.less';

const block = 'in-right-alignment';

export default function RightAlignment({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
