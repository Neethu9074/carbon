import React from 'react';

import ConfigureTimeWindow from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import ConfigureViolations from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureViolations';
import ConfigureUserImpact from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureUserImpact';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';

import locals from './TimeThresholdConfig.mless';

export default function ConfigureAlertingThreshold({ form, onChange, updateForm }) {
  const { violationsInPeriod, userImpactOfViolationsInSequence } = timeThresholdTypes;
  const timeThresholdType = form.get('timeThreshold').get('type').value;

  return (
    <div className={locals.alertThresholdConfigContainer}>
      <ConfigureTimeWindow form={form} updateForm={updateForm} />
      {timeThresholdType === violationsInPeriod && <ConfigureViolations onChange={onChange} form={form} />}
      {timeThresholdType === userImpactOfViolationsInSequence && (
        <ConfigureUserImpact form={form} onChange={onChange} updateForm={updateForm} />
      )}
    </div>
  );
}
