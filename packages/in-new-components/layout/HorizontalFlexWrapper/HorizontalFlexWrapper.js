import React, { forwardRef } from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './HorizontalFlexWrapper.mless';

export default forwardRef(function HorizontalFlexWrapper({ className, children }, ref) {
  return (
    <div ref={ref} className={joinClassNames(locals.wrapper, className)}>
      {children}
    </div>
  );
});
