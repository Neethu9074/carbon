/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { LegacyRef } from 'react';
import classNames from 'classnames';

import { IconButton } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { getDesignLibraryColorBySeverity, getDesignLibrarySeverityIcon } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './HealthIndicatorPresenter.mless';

interface Props {
  openIssues: number;
  maxSeverity: number;
  active: boolean;
  refSetter?: LegacyRef<HTMLAnchorElement>;
  onClick?: () => void;
  tooltipLabel?: string;
  tableUsage?: boolean;
  buttonSize?: 'regular' | 'xs' | 'l' | undefined;
}

export default function HealthIndicatorPresenter({
  openIssues,
  maxSeverity,
  active,
  refSetter,
  onClick,
  tooltipLabel: explanation,
  // Status Icons in table are 16px sizing so this toggles the size
  // 16px by default and 20px if false
  tableUsage = true,
  // Define the IconButton size you want to use
  // 32px, 40px, 48px
  buttonSize = 'regular'
}: Props) {
  const tooltipLabel = explanation ?? getTooltipLabel(openIssues, maxSeverity);

  // Green status!
  if (openIssues === 0) {
    return (
      <Tooltip content={tooltipLabel} delay={500}>
        <IconButton
          type="lib_uncheck"
          color={themes.default.ids.color.option.green[500]}
          iconSize={buttonSize}
          className={classNames({
            [locals.okayIcon]: true,
            [locals.carbonStatusTableSizing]: tableUsage
          })}
        />
      </Tooltip>
    );
  }

  // Warnings or Error status
  const color = active ? '#031F29' : getDesignLibraryColorBySeverity(maxSeverity);
  const type = getDesignLibrarySeverityIcon(maxSeverity);

  const statusContents = (
    <Tooltip content={tooltipLabel} delay={500}>
      <IconButton
        type={type}
        color={color}
        iconSize={buttonSize}
        className={classNames({
          [locals.icon]: true,
          [locals.carbonStatusTableSizing]: tableUsage,
          [locals.iconWarning]: !(maxSeverity > 5) && maxSeverity !== 0
        })}
      />
    </Tooltip>
  );

  // If no refSetter is passed we dont we can simply render the status icon as is
  // because there is no overlay to render.  Allows for more usability of this component
  if (refSetter) {
    return (
      <a
        href=""
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          if (onClick) {
            onClick();
          }
        }}
        className={locals.badge}
        ref={refSetter}
        tabIndex={-1}
      >
        {statusContents}
      </a>
    );
  } else {
    return statusContents;
  }
}

function getTooltipLabel(openIssues: number, maxSeverity: number): string {
  if (openIssues === 0) {
    return t('in-components:health.noIssues');
  }

  if (maxSeverity > 5) {
    return t('in-components:health.labelCritical');
  }

  return t('in-components:health.labelWarning');
}
