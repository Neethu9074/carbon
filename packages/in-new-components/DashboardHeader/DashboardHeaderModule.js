import React from 'react';

import { themes as headerThemes } from 'in-new-components/DashboardHeader/DashboardHeader';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './DashboardHeaderModule.mless';

export const themes = headerThemes;

export default function DashboardHeaderModule({
  className,
  theme = themes.default,
  withTopBorder = true,
  withBottomBorder = false,
  dropShadow = false,
  children
}) {
  return (
    <LeftRightPadding
      className={evaluateClassNames({
        [locals[theme]]: true,
        [locals[`${theme}WithTopBorder`]]: withTopBorder,
        [locals[`${theme}WithBottomBorder`]]: withBottomBorder,
        [locals.dropShadow]: dropShadow,
        [className]: className
      })}
    >
      {children}
    </LeftRightPadding>
  );
}
