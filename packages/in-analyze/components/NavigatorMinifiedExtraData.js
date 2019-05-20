import React from 'react';

import locals from './NavigatorMinifiedExtraData.mless';

export default function RawNavigatorMinifiedExtraData({ extras }) {
  return (
    <div className={locals.extraData}>
      {extras.filter(Boolean).map((extra, i) => (
        <span key={i}>{extra}</span>
      ))}
    </div>
  );
}
