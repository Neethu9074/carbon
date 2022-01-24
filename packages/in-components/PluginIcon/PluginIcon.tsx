/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import * as Immutable from 'immutable';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { SvgIcon } from '@instana/components';

import { getIconType } from 'in-infrastructure/infrastructureIconType';
import theme from 'in-themes';

interface PluginIconProps {
  size?: Size;
  color?: string;
  snapshot?: Immutable.Map<string, unknown>;
  plugin: string;
}

export default forwardRef(function PluginIcon(props: PluginIconProps, ref: React.ForwardedRef<SVGSVGElement>) {
  const { size, color = theme.lib.colors.N700Medium } = props;
  return <SvgIcon ref={ref} {...props} size={size} color={color} type={getIconType(props.snapshot ?? props.plugin)} />;
});
