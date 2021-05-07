/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { Button } from '@instana/components';

import DropdownButton from 'in-new-components/Button/DropdownButton';

import locals from './DashboardHeaderButton.mless';

export default forwardRef(function DashboardHeaderButton(
  { darkTheme, expanded, className, size = 'xl', ...buttonProps },
  ref
) {
  const Component = expanded != null ? DropdownButton : Button;

  return (
    <Component
      {...buttonProps}
      kind={darkTheme ? 'info' : 'secondary'}
      size={size}
      className={classNames(className, {
        [locals.light]: !darkTheme,
        [locals.dark]: darkTheme
      })}
      ref={ref}
    />
  );
});
