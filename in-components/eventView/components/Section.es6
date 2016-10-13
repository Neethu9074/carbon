import React from 'react';

import './Section.less';


const block = 'in-event-view-event-detail-section';

export default function Section({children}) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
