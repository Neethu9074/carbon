import React from 'react';

import locals from './ErrorIndicator.mless';

export default function ErrorIndicator({ erroneous, allowZero, small }) {
  if (!erroneous && !allowZero) {
    return null;
  }

  return <div className={small ? locals.errorIconSmall : locals.errorIcon}>!</div>;
}
