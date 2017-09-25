import React from 'react';

import './KV.less';

const block = 'in-dashboard-kv';

export default function KV({ k, v }) {
  if (!v) {
    return null;
  }

  return (
    <div className={block}>
      <div className={`${block}__key`}>
        {k}
      </div>
      {v}
    </div>
  );
}
