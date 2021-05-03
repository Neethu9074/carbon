/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';

import { SvgIcon } from '@instana/components';

import { getIconType } from 'in-infrastructure/infrastructureIconType';
import theme from 'in-themes';

export default forwardRef(function PluginIcon(props, ref) {
  const { size, color = theme.lib.colors.N700Medium } = props;
  return <SvgIcon ref={ref} {...props} size={size} color={color} type={getIconType(props.snapshot ?? props.plugin)} />;
});
