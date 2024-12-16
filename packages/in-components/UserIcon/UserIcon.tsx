/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon, SvgIconSizes } from '@instana/components';
import { themes } from '@instana/design-tokens';

export interface UserIconProps {
  type?: string;
  size?: keyof typeof SvgIconSizes | number;
  className?: string;
  color?: string;
}

export default function UserIcon({
  type = 'lib_menu_account',
  size,
  className,
  color = themes.default.ids.color.option.neutral['500']
}: UserIconProps) {
  return <SvgIcon color={color} type={type} size={size} className={className} />;
}
