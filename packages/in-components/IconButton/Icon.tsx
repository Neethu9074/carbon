/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';
import classNames from 'classnames';

import { IconComponentProps } from 'in-components/IconButton/types';
import { SvgIcon, SvgIconSizes } from '@instana/components';

// @ts-ignore
import locals from './IconButton.mless';

interface IconProps extends IconComponentProps {}

const iconDimensions = new Map<string, SvgIconSizes>([
  ['normal', 24],
  ['compact', 16]
]);

export default function Icon({ type, size = 'normal', iconSize, iconSpinning, kind = 'action', disabled }: IconProps) {
  const iSize: SvgIconSizes = (iconSize || iconDimensions.get(size)) ?? 24;
  return (
    <SvgIcon
      type={type}
      size={iSize}
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
