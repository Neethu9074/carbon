import React from 'react';

import locals from './LeftRightPadding.mless';

import classNames from 'classnames';

export default function LeftRightPadding({ children, className }) {
  return <div className={classNames(locals.wrapper, className)}>{children}</div>;
}
