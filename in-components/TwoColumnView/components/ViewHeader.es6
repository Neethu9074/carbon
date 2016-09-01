import React from 'react';

import './ViewHeader.less';


const block = 'in-two-columns-view-view-header';

export default function ViewHeader({children, className = ''}) {
  return (
    <div className={`${block} ${className}`}>
      {children}
    </div>
  );
}
