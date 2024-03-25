/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, SvgIconProps } from '@instana/components';

import { IconComponentProps } from 'in-components/IconButton/types';

// @ts-ignore
import locals from './IconButton.mless';

interface IconProps extends IconComponentProps {}

const iconDimensions = new Map<string, SvgIconProps['size']>([
  ['normal', 'regular'],
  ['compact', 'xs']
]);

export default function Icon({
  type,
  size = 'normal',
  iconSize,
  iconSpinning,
  kind = 'action',
  disabled,
  color
}: IconProps) {
  let iSize: typeof iconSize = 'regular';
  if (iconSize) {
    iSize = iconSize;
  } else if (size) {
    iSize = iconDimensions.get(size) ?? 'regular';
  }
  return (
    <SvgIcon
      type={type}
      size={iSize}
      color={color}
      className={classNames({
        [locals.icon]: true,
        [locals[`icon--${kind}`]]: kind,
        [locals.disabled]: disabled
      })}
      tabIndex={-1}
      spinning={iconSpinning}
    />
  );
}
