/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Tooltip } from '@instana/components';

import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import WithSubscript from 'in-components/WithSubscript/WithSubscript';
import AlertIcon from 'in-alerting/components/AlertIcon';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/list/NameColumnCell.mless';

interface SloAlertConfigType extends AlertConfigType {
  rule?: AlertConfigType['rule'] & {
    metric?: string;
  };
}

export function AlertNameColumn<AlertConfig extends SloAlertConfigType>({
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
  const { enabled, name, severity, rule } = config;
  const isBurnRateV1 = rule?.metric === 'BURN_RATE';

  const content = <span>{renderName ? renderName(config) : name}</span>;
  return (
    <div className={classNames(locals.main)}>
      {!hideAlertIcon && <AlertIcon severity={severity} enabled={enabled} />}
      <div className={classNames(locals.column)}>
        {isBurnRateV1 ? (
          <WithSubscript subscript={t('in-alerting:smartAlerts.slo.alertList.deprecatedLabel')}>
            <div className={classNames(locals.name)}>
              <Tooltip themeStyle="light" content={content} delay={500} overflowEllipsis>
                {content}
              </Tooltip>
              {getSubtitle && <div className={locals.nameSubtext}>{getSubtitle(config)}</div>}
            </div>
          </WithSubscript>
        ) : (
          <div className={classNames(locals.name)}>
            <Tooltip themeStyle="light" content={content} delay={500} overflowEllipsis>
              {content}
            </Tooltip>
            {getSubtitle && <div className={locals.nameSubtext}>{getSubtitle(config)}</div>}
          </div>
        )}
        {getAdditionalContent?.(config)}
      </div>
    </div>
  );
}
