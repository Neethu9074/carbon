import React from 'react';

import ConfigureTimeWindow from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import ConfigureViolations from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/ConfigureViolations';
import ConfigureUserImpact from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/ConfigureUserImpact';
import { fieldNames, radioOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

import locals from './TimeThresholdConfig.mless';

export default function ConfigureAlertingThreshold({ form, onChange }) {
  const { violationsInPeriod, userImpactOfViolationsInSequence } = radioOptions.timeThresholdType;
  const timeThresholdType = form.get(fieldNames.timeThresholdType).value;

  return (
    <div className={locals.alertThresholdConfigContainer}>
      <ConfigureTimeWindow onChange={onChange} form={form} />
      {timeThresholdType === violationsInPeriod && <ConfigureViolations onChange={onChange} form={form} />}
      {timeThresholdType === userImpactOfViolationsInSequence && (
        <ConfigureUserImpact form={form} onChange={onChange} />
      )}
    </div>
  );
}
