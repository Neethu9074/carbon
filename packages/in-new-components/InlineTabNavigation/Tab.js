/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { toInteractiveElement } from '@instana/components';

import WithHealthDot from 'in-new-components/health/WithHealthDot/WithHealthDot';
import { emptyObject } from 'in-services/fixedObjects';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import Tooltip from 'in-components/Tooltip/Tooltip';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Tab.mless';

export default function Tab({
  icon,
  text,
  index,
  isActive,
  isDisabled = false,
  disabledReason,
  onTabSelect,
  healthSeverity,
  withoutBottomBorder
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

  let interactivityProps = emptyObject;
  if (onTabSelect && !isDisabled) {
    interactivityProps = toInteractiveElement({
      ariaLabel: t('in-new-components:inlineTabNavigation.labelSelectTab'),
      onDefaultInteraction: () => onTabSelect(index)
    });
  }

  const item = (
    <li
      className={classNames({
        [locals.tab]: true,
        [locals.active]: isActive,
        [locals.disabled]: isDisabled,
        [locals.interactive]: onTabSelect && !isDisabled,
        [locals.withoutBottomBorder]: withoutBottomBorder
      })}
      {...interactivityProps}
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

Tab.propTypes = {
  disabledReason: PropTypes.node,
  healthSeverity: WithHealthDot.propTypes.severity,
  icon: PropTypes.string,
  index: PropTypes.number,
  isActive: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onTabSelect: PropTypes.func,
  text: PropTypes.string,
  withoutBottomBorder: PropTypes.bool
};
