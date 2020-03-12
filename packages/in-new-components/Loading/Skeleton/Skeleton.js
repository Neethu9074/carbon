import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Skeleton.mless';

export default function SkeletonCellContent({ className, style, lightMode }) {
  return (
    <span
      style={style}
      className={evaluateClassNames({
        [locals.skeleton]: true,
        [locals.lightMode]: lightMode,
        [className]: className
      })}
    />
  );
}
