import React from 'react';

import './Section.less';

const block = 'in-config-view-section';

export default function Section({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
