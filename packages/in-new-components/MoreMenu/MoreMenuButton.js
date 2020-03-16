import React from 'react';

import Button from 'in-new-components/Button';

import locals from './MoreMenuButton.mless';

export default function MoreMenuButton(props) {
  return (
    <li className={locals.item}>
      <Button kind="secondary" {...props} className={locals.button} />
    </li>
  );
}
