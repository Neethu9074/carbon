/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import ConfigureTimeToFailure from 'in-alerting/smart-alerts/infrastructure/components/ConfigureTimeToFailure';
import BorderedContainer from 'in-alerting/components/BorderedContainer';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/components/InfraPredictiveTrigger.mless';

interface InfraPredictiveTriggerProps {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
}

export default function InfraPredictiveTrigger({ form, updateForm }: InfraPredictiveTriggerProps) {
  return (
    <BorderedContainer>
      <div className={locals.container}>
        <h3 className={locals.headline}>
          {t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.predictiveTrigger.title')}
        </h3>
        <BorderedContainer>
          <ConfigureTimeToFailure form={form} updateForm={updateForm} />
        </BorderedContainer>
      </div>
    </BorderedContainer>
  );
}
