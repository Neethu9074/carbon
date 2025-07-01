/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import ConfigureAlertingThresholdTearSheet from 'in-alerting/smart-alerts/components/tearSheet/ConfigureAlertingThreshold';
import SelectTimeThresholdTearSheet from 'in-alerting/smart-alerts/components/tearSheet/SelectTimeThreshold';

export default function TimeThresholdConfigPresenter({
  form,
  onChange,
  updateForm,
  hasTraceImpactOption,
  hasUserImpactOption,
  impactTimeThresholdDisabled
}) {
  return (
    <>
      <SelectTimeThresholdTearSheet
        form={form}
        updateForm={updateForm}
        hasUserImpactOption={hasUserImpactOption}
        hasTraceImpactOption={hasTraceImpactOption}
        impactTimeThresholdDisabled={impactTimeThresholdDisabled}
      />
      <ConfigureAlertingThresholdTearSheet form={form} onChange={onChange} updateForm={updateForm} />
    </>
  );
}

TimeThresholdConfigPresenter.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  hasTraceImpactOption: PropTypes.bool,
  hasUserImpactOption: PropTypes.bool,
  impactTimeThresholdDisabled: PropTypes.bool
};
