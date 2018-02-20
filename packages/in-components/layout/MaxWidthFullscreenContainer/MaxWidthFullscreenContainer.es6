import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './MaxWidthFullscreenContainer.mless';

export default function MaxWidthFullscreenContainer({ children, className }) {
  return <div className={joinClassNames(locals.wrapper, className)}>{children}</div>;
}
