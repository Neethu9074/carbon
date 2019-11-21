import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Tab.mless';

export default function Tab({ className, isSelected, isDisabled, onTabClicked, children }) {
  return (
    <li
      className={evaluateClassNames({
        [locals.tab]: true,
        [locals.selectedTab]: isSelected,
        [locals.disabledTab]: isDisabled,
        [className]: className
      })}
      onClick={onTabClicked}
    >
      {children}
    </li>
  );
}
