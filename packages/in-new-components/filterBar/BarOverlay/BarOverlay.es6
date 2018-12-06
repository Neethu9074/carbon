import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './BarOverlay.mless';

export default function BarOverlay({ children, extraWide, extraExtraWide, allowOverflow }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.overlay]: true,
        [locals.extraWide]: extraWide && !extraExtraWide,
        [locals.extraExtraWide]: extraExtraWide,
        [locals.allowOverflow]: allowOverflow
      })}
    >
      {children}
    </div>
  );
}
