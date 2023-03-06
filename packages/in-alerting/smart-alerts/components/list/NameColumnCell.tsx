/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import { AlertConfigType } from 'in-alerting/smart-alerts/components/AlertsBaseList';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/components/list/NameColumnCell.mless';

export function NameColumnCell<AlertConfig extends AlertConfigType>({
  config,
  getSubtitle,
  getAdditionalContent
}: {
  config: AlertConfig;
  getSubtitle?: (config: AlertConfig) => string;
  getAdditionalContent?: (config: AlertConfig) => ReactNode;
}) {
  const { description, name, severity } = config;
  return (
    <div className={classNames(locals.main)}>
      <SvgIcon
        className={classNames({
          [locals.alertIcon]: true,
          [locals.alertIconSeverityLow]: severity <= 5,
          [locals.alertIconSeverityHigh]: severity > 5
        })}
        type="lib_alerts_alert"
      />
      <div className={classNames(locals.column)}>
        <div className={classNames(locals.name)}>
          <Tooltip themeStyle="light" content={description} align="topMiddle" delay={500}>
            <span>{name}</span>
          </Tooltip>
          {getSubtitle && <div className={locals.nameSubtext}>{getSubtitle(config)}</div>}
        </div>
        {getAdditionalContent?.(config)}
      </div>
    </div>
  );
}
