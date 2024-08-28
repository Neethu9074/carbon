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
}

export default function HealthIndicatorPresenter({
  openIssues,
  maxSeverity,
  active,
  refSetter,
  onClick,
  tooltipLabel: explanation
}: Props) {
  const tooltipLabel = explanation ?? getTooltipLabel(openIssues, maxSeverity);

  if (openIssues === 0) {
    return (
      <Tooltip content={tooltipLabel} delay={500}>
        <IconButton type="lib_uncheck" color={themes.default.ids.color.option.green[500]} className={locals.okayIcon} />
      </Tooltip>
    );
  }

  const color = active ? '#031F29' : getDesignLibraryColorBySeverity(maxSeverity);
  const type = getDesignLibrarySeverityIcon(maxSeverity);

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
    >
      <Tooltip content={tooltipLabel} delay={500}>
        <IconButton
          type={type}
          color={color}
          className={classNames({
            [locals.icon]: true,
            [locals.iconWarning]: !(maxSeverity > 5) && maxSeverity !== 0
          })}
        />
      </Tooltip>
    </a>
  );
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
