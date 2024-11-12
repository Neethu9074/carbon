/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { MoreMenuButton as CarbonMoreMenuButton, MoreMenuButtonProps, Button } from '@instana/components';

import { carbonMoreMenuEnabled } from 'in-services/featureFlags';

import locals from './MoreMenuButton.mless';

export default forwardRef<HTMLLIElement, MoreMenuButtonProps>(function MoreMenuButton(props, ref) {
  if (carbonMoreMenuEnabled) {
    return <CarbonMoreMenuButton {...props} ref={ref} />;
  }
  return (
    <li className={locals.item} ref={ref}>
      <Button kind="secondary" {...props} className={locals.button} />
    </li>
  );
});
