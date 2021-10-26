/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import { themes as headerThemes } from 'in-components/DashboardHeader/DashboardHeader';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';

import locals from './DashboardHeaderModule.mless';

export const themes = headerThemes;

interface Props {
  className?: string;
  theme?: 'light' | 'dark' | 'default';
  withTopBorder?: boolean;
  withBottomBorder?: boolean;
  children: React.ReactNode;
}

export default function DashboardHeaderModule({
  className = '',
  theme = themes.default,
  withTopBorder = true,
  withBottomBorder = false,
  children
}: Props) {
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
