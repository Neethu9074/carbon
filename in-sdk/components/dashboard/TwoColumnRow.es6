import React from 'react';

import './TwoColumnRow.less';

const block = 'in-dashboard-columize';

export default function TwoColumnRow({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
