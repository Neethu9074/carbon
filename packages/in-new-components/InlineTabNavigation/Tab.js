import React from 'react';

import WithHealthDot from 'in-new-components/health/WithHealthDot/WithHealthDot';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Tooltip from 'in-components/Tooltip/Tooltip';
import theme from 'in-themes';

import locals from './Tab.mless';

export default function Tab({
  icon,
  text,
  index,
  isActive,
  isDisabled = false,
  disabledReason,
  onTabSelect,
  healthSeverity
}) {
  let iconElement = icon && (
    <SvgIcon
      className={locals.tabIcon}
      type={icon}
      color={isDisabled ? theme.lib.colors.N400 : isActive ? theme.lib.colors.N900Primary : theme.lib.colors.N600Light}
    />
  );

  if (healthSeverity && iconElement) {
    iconElement = (
      <WithHealthDot severity={healthSeverity} iconSize={10}>
        {iconElement}
      </WithHealthDot>
    );
  }

  const item = (
    <li
      className={evaluateClassNames({
        [locals.tab]: true,
        [locals.active]: isActive,
        [locals.disabled]: isDisabled
      })}
      onClick={() => !isDisabled && onTabSelect(index)}
    >
      <div className={locals.tabInner}>
        {iconElement}
        <span>{text}</span>
      </div>
    </li>
  );

  if (isDisabled && disabledReason) {
    return (
      <Tooltip content={disabledReason} align="rightBottom" themeStyle="dark">
        {item}
      </Tooltip>
    );
  } else {
    return item;
  }
}
