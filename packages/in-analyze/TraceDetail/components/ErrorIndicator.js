import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './ErrorIndicator.mless';

export default function ErrorIndicator({ erroneous, allowZero, small }) {
  if (!erroneous && !allowZero) {
    return null;
  }

  return (
    <div
      className={evaluateClassNames({
        [locals.errorIcon]: true,
        [locals.errorIconDefault]: !small,
        [locals.errorIconSmall]: small
      })}
    >
      !
    </div>
  );
}
