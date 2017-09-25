import React from 'react';

import './KVSection.less';

const block = 'in-dashboard-kv-section';

export default function KVSection({ children }) {
  return (
    <div className={block}>
      {children}
    </div>
  );
}
