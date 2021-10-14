/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm } from 'formalistic';
import React, { useState } from 'react';

import SelectTimeThreshold from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';

export default {
  component: SelectTimeThreshold
};

export const Default = props => {
  const init = createMapForm().put('timeThreshold', createViolationsInSequenceForm({}));

  let [form, updateForm] = useState(init);
  return <SelectTimeThreshold {...props} form={form} updateForm={updateForm} />;
};

Default.args = {
  hasRequestImpactOption: false,
  hasUserImpactOption: false,
  impactTimeThresholdDisabled: false
};
