import React from 'react';

import classNames from 'classnames';

import locals from './MaxWidthFullscreenContainer.mless';

export default function MaxWidthFullscreenContainer({ children, className }) {
  return <div className={classNames(locals.wrapper, className)}>{children}</div>;
}
