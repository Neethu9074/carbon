/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { themes as headerThemes } from 'in-new-components/DashboardHeader/DashboardHeader';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';

import locals from './DashboardHeaderModule.mless';

export const themes = headerThemes;

export default function DashboardHeaderModule({
  className,
  theme = themes.default,
  withTopBorder = true,
  withBottomBorder = false,
  children
}) {
  return (
    <LeftRightPadding
      className={classNames({
        [locals[theme]]: true,
        [locals[`${theme}WithTopBorder`]]: withTopBorder,
        [locals[`${theme}WithBottomBorder`]]: withBottomBorder,
        [className]: className
      })}
    >
      {children}
    </LeftRightPadding>
  );
}
