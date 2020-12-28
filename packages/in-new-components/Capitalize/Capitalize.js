import classNames from 'classnames';
import React from 'react';

import locals from './Capitalize.mless';

export default function Capitalize({ children, className }) {
  return <span className={classNames(locals.wrapper, className)}>{children}</span>;
}
