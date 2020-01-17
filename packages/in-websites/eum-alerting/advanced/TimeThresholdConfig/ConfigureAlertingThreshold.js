import React from 'react';

import ConfigureViolationsInSequence from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/ConfigureViolationsInSequence';
import ConfigureViolationsInPeriod from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/ConfigureViolationsInPeriod';
import { selectOptions, fieldNames, radioOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import ConfigureUserImpactOfViolationsInSequence from './ConfigureUserImpactOfViolationsInSequence';

import locals from './TimeThresholdConfig.mless';

export default function ConfigureAlertingThreshold({ form, onChange }) {
  const { userImpactOfViolationsInSequence, violationsInPeriod } = radioOptions.timeThresholdType;
  const timeThresholdType = form.get(fieldNames.timeThresholdType).value;

  return (
    <div className={locals.alertThresholdConfigContainer}>
      <ConfigureViolationsInSequence items={selectOptions.conditionPersistenceTime} onChange={onChange} form={form} />
      {timeThresholdType === violationsInPeriod && <ConfigureViolationsInPeriod onChange={onChange} form={form} />}
      {timeThresholdType === userImpactOfViolationsInSequence && (
        <ConfigureUserImpactOfViolationsInSequence form={form} onChange={onChange} />
      )}
    </div>
  );
}
