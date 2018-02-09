import React from 'react';

import locals from './SqlTopListRow.mless';

export default function TopListRow({ label, avgMs, times, maxMs }) {
  return (
    <li className={locals.topListRow}>
      <div className={locals.titles}>
        <div>
          <span>{label}</span>
        </div>
        <div>
          <span>{`Average duration: ${avgMs}ms (${times}×)`}</span>
        </div>
      </div>
      <div className={locals.bar}>
        <div
          className={locals.barInner}
          style={{
            width: `${avgMs / maxMs * 100}%`,
            background: '#38f7ff'
          }}
        />
      </div>
    </li>
  );
}
