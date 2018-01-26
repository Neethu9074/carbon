import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import locals from './HorizontalIndicator.mless';

export default function HorizontalIndicator({ progress, rounded = false }) {
  const innerStyle = {};
  if (progress.percentage != null) {
    innerStyle.width = `${progress.percentage * 100}%`;
  } else {
    innerStyle.right = '0';
  }

  return (
    <div
      className={evaluateClassNames({
        [locals.outer]: true,
        [locals.rounded]: rounded
      })}
    >
      <div
        className={evaluateClassNames({
          [locals.inner]: true,
          [locals.indeterminate]: progress.percentage == null
        })}
        style={innerStyle}
      />
    </div>
  );
}
