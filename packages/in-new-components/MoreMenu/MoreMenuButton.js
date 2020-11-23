import React, { forwardRef } from 'react';

import Button from 'in-new-components/Button';

import locals from './MoreMenuButton.mless';

export default forwardRef(function MoreMenuButton(props, ref) {
  return (
    <li className={locals.item} ref={ref}>
      <Button kind="secondary" {...props} className={locals.button} />
    </li>
  );
});
