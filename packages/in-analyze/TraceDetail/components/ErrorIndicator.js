import React from 'react';

import locals from './ErrorIndicator.mless';

export default function ErrorIndicator({ errorCount, allowZero }) {
  // also on 0
  if (!errorCount && !allowZero) {
    return null;
  }

  return <div className={locals.errorIcon}>!</div>;
}
