/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import { t } from 'in-i18n';

export default function BlueprintSectionTitle() {
  const { form } = useSloAlertFormContext();

  const alertMetricValue = form.getIn(['rule', 'metric']).value;

  return (
    <>
      <Typography variant="heading-200" component="h2" noMargin>
        {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprint', {
          context: alertMetricValue
        })}
      </Typography>
      <Typography variant="body-small" component="p">
        {t('in-alerting:smartAlerts.slo.advancedModeContainer.blueprintDescription', {
          context: alertMetricValue
        })}
      </Typography>
    </>
  );
}
