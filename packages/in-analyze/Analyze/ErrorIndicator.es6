import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './ErrorIndicator.mless';

export default function ErrorIndicator({ className, errorCount }) {
  // also on 0
  if (!errorCount) {
    return null;
  }

  return (
    <div
      className={evaluateClassNames({
        [locals.errorIndicator]: true,
        [className]: className
      })}
    >
      {errorCount}
    </div>
  );
}
