/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { MoreMenuButton as CarbonMoreMenuButton, MoreMenuButtonProps } from '@instana/components';
import { Button } from '@instana/legacy';

import { carbonMoreMenuEnabled } from 'in-services/featureFlags';

import locals from './MoreMenuButton.mless';

export default forwardRef<HTMLLIElement, MoreMenuButtonProps>(function MoreMenuButton(props, ref) {
  if (carbonMoreMenuEnabled) {
    return <CarbonMoreMenuButton carbonVariant={carbonMoreMenuEnabled} {...props} ref={ref} />;
  }
  return (
    <li className={locals.item} ref={ref}>
      <Button kind="secondary" {...props} className={locals.button} />
    </li>
  );
});
