import React, { forwardRef } from 'react';

import classNames from 'classnames';

import locals from './HorizontalFlexWrapper.mless';

export default forwardRef(function HorizontalFlexWrapper({ className, children }, ref) {
  return (
    <div ref={ref} className={classNames(locals.wrapper, className)}>
      {children}
    </div>
  );
});
