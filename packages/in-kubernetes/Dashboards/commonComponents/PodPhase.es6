import React from 'react';

import locals from './PodPhase.mless';

export default function PodPhase({ status }) {
  return (
    <div className={locals.statusWrapper}>
      <span className={locals.statusLabel}>{status}</span>
    </div>
  );
}
