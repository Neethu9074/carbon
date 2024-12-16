/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { MoreMenuButton as CarbonMoreMenuButton, MoreMenuButtonProps } from '@instana/components';

export default forwardRef<HTMLLIElement, MoreMenuButtonProps>(function MoreMenuButton(props, ref) {
  return <CarbonMoreMenuButton {...props} ref={ref} />;
});
