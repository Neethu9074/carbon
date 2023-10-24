/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { toInteractiveElement } from '@instana/components';
import { SvgIcon } from '@instana/components';

import WithHealthDot from 'in-components/health/WithHealthDot/WithHealthDot';
import { emptyObject } from 'in-services/fixedObjects';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

import locals from './Tab.mless';

export interface TabProps {
  disabledReason?: ReactNode;
  healthSeverity?: number;
  icon?: string;
  index?: number;
  isActive?: boolean;
  isDisabled?: boolean;
  onTabSelect?: (index: number) => void;
  text?: string;
  withoutBottomBorder?: boolean;
}

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
}: TabProps) {
  const theme = useTheme();
  let iconElement = icon && (
    <SvgIcon
      className={locals.tabIcon}
      type={icon}
      color={
        isDisabled
          ? theme.ids.color.option.neutral['400']
          : isActive
          ? theme.ids.color.option.neutral['900']
          : theme.ids.color.option.neutral['600']
      }
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
      ariaLabel: t('in-components:inlineTabNavigation.labelSelectTab'),
      onDefaultInteraction: () => onTabSelect(index ?? 0)
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
