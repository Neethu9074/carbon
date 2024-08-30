/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import AlertIcon from 'in-alerting/components/AlertIcon';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-alerting/smart-alerts/components/list/NameColumnCell.mless';

export function NameColumnCell<AlertConfig extends AlertConfigType>({
  config,
  renderName,
  getSubtitle,
  getAdditionalContent,
  hideAlertIcon = false
}: {
  config: AlertConfig;
  renderName?: ((config: AlertConfig) => string) | ((config: AlertConfig) => ReactNode);
  getSubtitle?: ((config: AlertConfig) => string) | ((config: AlertConfig) => JSX.Element);
  getAdditionalContent?: (config: AlertConfig) => ReactNode;
  hideAlertIcon?: boolean;
}) {
  const { enabled, name, severity } = config;
  const content = <span>{renderName ? renderName(config) : name}</span>;
  return (
    <div className={classNames(locals.main)}>
      {!hideAlertIcon && <AlertIcon severity={severity} enabled={enabled} />}
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
