/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/components/list/NameColumnCell.mless';

export function NameColumnCell<AlertConfig extends AlertConfigType>({
  config,
  renderName,
  getSubtitle,
  getAdditionalContent
}: {
  config: AlertConfig;
  renderName?: ((config: AlertConfig) => string) | ((config: AlertConfig) => ReactNode);
  getSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element);
  getAdditionalContent?: (config: AlertConfig) => ReactNode;
}) {
  const { enabled, name, severity } = config;
  const content = <span>{renderName ? renderName(config) : name}</span>;
  return (
    <div className={classNames(locals.main)}>
      <SvgIcon
        className={classNames({
          [locals.alertIcon]: true,
          [locals.alertIconSeverityLow]: severity <= 5,
          [locals.alertIconSeverityHigh]: severity > 5
        })}
        type={enabled ? 'lib_alerts_create' : 'lib_actions_pause'}
      />
      <div className={classNames(locals.column)}>
        <div className={classNames(locals.name)}>
          <Tooltip themeStyle="light" content={content} delay={500} overflowEllipsis>
            {content}
          </Tooltip>
          {getSubtitle && <div className={locals.nameSubtext}>{getSubtitle(config)}</div>}
        </div>
        {getAdditionalContent?.(config)}
      </div>
    </div>
  );
}
