import React, { forwardRef } from 'react';

import locals from './WithSubscript.mless';

export default forwardRef(function WithSubscript({ subscript, children }, ref) {
  return (
    <div className={locals.container} ref={ref}>
      {children}
      {subscript && <span className={locals.smallTextBelow}>{subscript} </span>}
    </div>
  );
});
