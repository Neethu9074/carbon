/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import locals from './SubViewHeader.mless';

export default function SubViewHeader({ children, iconType, iconColor }) {
  return (
    <div>
      {iconType && (
        <SvgIcon className={locals.icon} type={iconType} color={iconColor ?? themes.default.ids.color.option.black} />
      )}
      <h3 className={locals.header}>{children}</h3>
    </div>
  );
}
