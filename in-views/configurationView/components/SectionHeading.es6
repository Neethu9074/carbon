import React from 'react';

import './SectionHeading.less';

const block = 'in-config-view-section-heading';

export default function SectionHeading({ children }) {
  return (
    <h3 className={block}>
      {children}
    </h3>
  );
}
