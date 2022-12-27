/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { LegacyRef } from 'react';

import { SvgIcon } from '@instana/components';

import { getDesignLibraryColorBySeverity } from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';

import locals from './HealthIndicatorPresenter.mless';

interface Props {
  openIssues: number | string;
  maxSeverity: number;
  active: boolean;
  refSetter?: LegacyRef<HTMLAnchorElement>;
  onClick?: () => void;
  tooltipLabel: string;
}

export default function HealthIndicatorPresenter({
  openIssues,
  maxSeverity,
  active,
  refSetter,
  onClick,
  tooltipLabel
}: Props) {
  if (openIssues === 0 || openIssues === 'No Issues') {
    return (
      <Tooltip content={tooltipLabel} delay={500}>
        <SvgIcon type="lib_check" className={locals.okayIcon} />
      </Tooltip>
    );
  }

  let color = getDesignLibraryColorBySeverity(maxSeverity);
  if (active) {
    color = '#031F29';
  }
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
        <SvgIcon type="lib_help_error_warning" color={color} className={locals.icon} />
      </Tooltip>
    </a>
  );
}
