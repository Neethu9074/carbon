/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { forwardRef } from 'react';
import theme from 'in-themes';

import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import SvgIcon from 'in-components/SvgIcon';

export default forwardRef(function PluginIcon(props, ref) {
  const { size, color = theme.lib.colors.N700Medium } = props;
  return <SvgIcon ref={ref} {...props} size={size} color={color} type={getIconType(props.snapshot ?? props.plugin)} />;
});
