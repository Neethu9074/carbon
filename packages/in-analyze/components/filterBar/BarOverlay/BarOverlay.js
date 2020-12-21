import React from 'react';

import classNames from 'classnames';

import locals from './BarOverlay.mless';

export default function BarOverlay({ children, extraWide, extraExtraWide, allowOverflow }) {
  return (
    <div
      className={classNames({
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
