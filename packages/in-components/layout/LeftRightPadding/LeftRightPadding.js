import classNames from 'classnames';
import React from 'react';

import locals from './LeftRightPadding.mless';

export default function LeftRightPadding({ children, className }) {
  return <div className={classNames(locals.wrapper, className)}>{children}</div>;
}
