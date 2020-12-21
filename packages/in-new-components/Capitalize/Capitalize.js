import React from 'react';

import classNames from 'classnames';

import locals from './Capitalize.mless';

export default function Capitalize({ children, className }) {
  return <span className={classNames(locals.wrapper, className)}>{children}</span>;
}
