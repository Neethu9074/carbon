/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import { useTheme } from 'in-themes';

import locals from './SubViewHeader.mless';

export default function SubViewHeader({ children, iconType, iconColor }) {
  const theme = useTheme();
  return (
    <div>
      {iconType && (
        <SvgIcon className={locals.icon} type={iconType} color={iconColor ?? theme.ids.color.option.black} />
      )}
      <h1 className={locals.header}>{children}</h1>
    </div>
  );
}
