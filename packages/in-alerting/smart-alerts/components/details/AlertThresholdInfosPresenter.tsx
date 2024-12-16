/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import { t } from 'in-i18n';

import locals from './AlertThresholdInfosPresenter.mless';

interface Props {
  thresholdTypeLabel: string;
  metricLabel: string;
  scopeLabel: string;
  threshold?: React.ReactElement;
}

export const AlertThresholdInfosPresenter = ({ thresholdTypeLabel, metricLabel, threshold, scopeLabel }: Props) => {
  return (
    <div className={locals.tilesRow}>
      <div className={locals.tile}>
        <KeyValue
          label={t('in-alerting:smartAlerts.details.thresholdTypeTitle')}
          value={thresholdTypeLabel}
          className={locals.keyValueExtraGap}
          multilineLabel
        />
      </div>
      <div className={locals.tile}>
        <KeyValue
          label={t('in-alerting:smartAlerts.details.metricTitle')}
          value={metricLabel}
          className={locals.keyValueExtraGap}
          multilineLabel
        />
      </div>
      {threshold && (
        <div className={locals.tile}>
          <KeyValue
            label={t('in-alerting:smartAlerts.details.threshold')}
            value={threshold}
            className={locals.keyValueExtraGap}
            multilineLabel
          />
        </div>
      )}
      {scopeLabel && (
        <div className={locals.tile}>
          <KeyValue
            label={t('in-alerting:smartAlerts.details.entityTitle')}
            value={scopeLabel}
            className={locals.keyValueExtraGap}
            multilineLabel
          />
        </div>
      )}
    </div>
  );
};
