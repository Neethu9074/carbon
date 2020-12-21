import React from 'react';

import classNames from 'classnames';

import locals from './Skeleton.mless';

export default function SkeletonCellContent({ className, style, lightMode }) {
  return (
    <span
      style={style}
      className={classNames({
        [locals.skeleton]: true,
        [locals.lightMode]: lightMode,
        [className]: className
      })}
    />
  );
}
