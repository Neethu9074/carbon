/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import theme from 'in-themes';

import locals from './SubViewHeader.mless';

export default function SubViewHeader({ children, iconType, iconColor = theme.lib.colors.black }) {
  return (
    <div>
      {iconType && <SvgIcon className={locals.icon} type={iconType} color={iconColor} />}
      <h1 className={locals.header}>{children}</h1>
    </div>
  );
}
