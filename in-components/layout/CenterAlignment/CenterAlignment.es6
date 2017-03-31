import React from 'react';

import './CenterAlignment.less';

const block = 'in-center-alignment';

export default function CenterAlignment({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
