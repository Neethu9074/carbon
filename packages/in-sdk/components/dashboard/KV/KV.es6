import React from 'react';

import locals from './KV.mless';

export default function KV({ k, v }) {
  if (v == undefined) {
    return null;
  }

  return (
    <div className={locals.kv}>
      <div className={locals.kvKey}>{k}</div>
      {v}
    </div>
  );
}
