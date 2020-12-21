import React from 'react';

import classNames from 'classnames';

import locals from './StanImage.mless';

export default function StanImage({ className }) {
  return (
    <div
      className={classNames({
        [locals.stan]: true,
        [className]: className
      })}
    />
  );
}
