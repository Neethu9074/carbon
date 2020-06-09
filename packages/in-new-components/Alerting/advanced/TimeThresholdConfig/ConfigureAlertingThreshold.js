import PropTypes from 'prop-types';
import React from 'react';

import ConfigureGranularity from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureGranularity';
import ConfigureTimeWindow from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureTimeWindow';
import ConfigureViolations from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureViolations';
import ConfigureUserImpact from 'in-new-components/Alerting/advanced/TimeThresholdConfig/ConfigureUserImpact';
import { timeThresholdTypes } from 'in-new-components/Alerting/advanced/TimeThresholdConfig/formData';
import { minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';

import locals from './TimeThresholdConfig.mless';

const violationGranularityDefault = minutesToMillis(10);

export default function ConfigureAlertingThreshold({ form, onChange, updateForm }) {
  const { violationsInPeriod, userImpactOfViolationsInSequence } = timeThresholdTypes;
  const granularity = form.get('granularity')?.value;
  const timeThresholdForm = form.get('timeThreshold');
  const timeThresholdType = timeThresholdForm.get('type')?.value;
  const timeThresholdTimeWindow = timeThresholdForm.get('timeWindow').value;
  const timeThresholdViolations = timeThresholdForm.get('violations')?.value;

  return (
    <div className={locals.alertThresholdConfigContainer}>
      {granularity && <ConfigureGranularity onChange={onChangeGranularity} granularity={granularity} />}

      <ConfigureTimeWindow
        onChange={onChangeTimeWindow}
        timeThresholdTimeWindow={timeThresholdTimeWindow}
        timeThresholdType={timeThresholdType}
        granularity={granularity ?? violationGranularityDefault}
      />

      {timeThresholdType === violationsInPeriod && (
        <ConfigureViolations
          onChange={onChange}
          timeThresholdTimeWindow={timeThresholdTimeWindow}
          timeThresholdViolations={timeThresholdViolations?.toString()}
          violationGranularity={granularity ?? violationGranularityDefault}
        />
      )}
      {timeThresholdType === userImpactOfViolationsInSequence && (
        <ConfigureUserImpact form={form} onChange={onChange} updateForm={updateForm} />
      )}
    </div>
  );

  function onChangeTimeWindow(timeWindowValue) {
    let updatedForm = timeThresholdForm.updateIn(['timeWindow'], f => f.setValue(timeWindowValue).setTouched(true));
    if (timeThresholdType === violationsInPeriod) {
      const granularity = form.get('granularity').value;
      const oldViolations = timeThresholdForm.get('violations').value;
      const maxViolations = parseInt(timeWindowValue / granularity);
      updatedForm = updatedForm.updateIn(['violations'], f =>
        f.setValue(Math.min(oldViolations, maxViolations)).setTouched(true)
      );
    }
    updateForm(form.put('timeThreshold', updatedForm));
  }

  function onChangeGranularity(newGranularity) {
    const oldGranularity = form.get('granularity').value;
    const oldTimeWindow = form.get('timeThreshold').get('timeWindow').value;
    const violations = parseInt(oldTimeWindow / oldGranularity);

    updateForm(
      form
        .updateIn(['granularity'], f => f.setValue(newGranularity).setTouched(true))
        .updateIn(['timeThreshold', 'timeWindow'], f => f.setValue(violations * newGranularity).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }
}

ConfigureAlertingThreshold.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
