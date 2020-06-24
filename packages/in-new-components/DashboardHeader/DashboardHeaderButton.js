import React from 'react';

import DropdownButton from 'in-new-components/Button/DropdownButton';
import { evaluateClassNames } from 'in-services/util/classnames';
import Button from 'in-new-components/Button/Button';

import locals from './DashboardHeaderButton.mless';

export default function DashboardHeaderButton(props) {
  const { darkTheme, expanded, className, size = 'xl' } = props;
  const Component = expanded != null ? DropdownButton : Button;

  return (
    <Component
      {...props}
      kind={darkTheme ? 'info' : 'secondary'}
      size={size}
      className={evaluateClassNames({
        [locals.light]: !darkTheme,
        [locals.dark]: darkTheme,
        [className]: className
      })}
    />
  );
}
