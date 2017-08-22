import React from 'react';

import './Columize.less';

const block = 'in-dashboard-columize';

export default function Columize({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
