import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './ErrorIndicator.mless';

export default function ErrorIndicator({ className, errorCount }) {
  // also on 0
  if (!errorCount) {
    return null;
  }

  return <div className={joinClassNames(locals.errorIndicator, className)}>{errorCount}</div>;
}
