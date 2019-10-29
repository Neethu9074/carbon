import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './StanImage.mless';

export default function StanImage({ className }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.stan]: true,
        [className]: className
      })}
    />
  );
}
