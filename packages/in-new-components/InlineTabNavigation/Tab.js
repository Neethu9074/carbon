import React from 'react';

import WithHealthDot from 'in-new-components/health/WithHealthDot/WithHealthDot';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import theme from 'in-themes';

import locals from './Tab.mless';

export default function Tab({ icon, text, index, isActive, onTabSelect, healthSeverity }) {
  const Icon = () => (
    <SvgIcon
      className={locals.tabIcon}
      type={icon}
      color={isActive ? theme.lib.colors.N900Primary : theme.lib.colors.N600Light}
    />
  );

  return (
    <li
      className={evaluateClassNames({
        [locals.tab]: true,
        [locals.active]: isActive
      })}
      onClick={() => onTabSelect(index)}
    >
      <div className={locals.tabInner}>
        {healthSeverity ? (
          <WithHealthDot severity={healthSeverity} iconSize={10}>
            <Icon />
          </WithHealthDot>
        ) : (
          <Icon />
        )}

        <span>{text}</span>
      </div>
    </li>
  );
}
