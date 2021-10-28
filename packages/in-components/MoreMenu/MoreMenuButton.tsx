/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { Button } from '@instana/components';

import locals from './MoreMenuButton.mless';

export default forwardRef(function MoreMenuButton(props, ref) {
  return (
    <li className={locals.item} ref={ref}>
      <Button kind="secondary" {...props} className={locals.button} />
    </li>
  );
});
