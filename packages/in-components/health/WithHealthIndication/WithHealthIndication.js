import React from 'react';

import { getColorBySeverity } from 'in-stores/events';

import locals from './WithHealthIndication.mless';

export default function WithHealthIndication({ children, size = 24, healthInfo }) {
  if (!healthInfo || healthInfo.maxSeverity === 0) {
    return children;
  }

  const iconSize = 2 + ((size / 8) | 1) * 2;

  return (
    <div className={locals.wrapper}>
      {children}
      <div
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          right: `calc(100% - ${size}px)`,
          background: getColorBySeverity(healthInfo.maxSeverity)
        }}
        className={locals.dot}
      />
    </div>
  );
}
