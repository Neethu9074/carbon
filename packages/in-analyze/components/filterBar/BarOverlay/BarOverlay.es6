import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './BarOverlay.mless';

export default function BarOverlay({ children, extraWide }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.overlay]: true,
        [locals.extraWide]: extraWide
      })}
    >
      {children}
    </div>
  );
}
