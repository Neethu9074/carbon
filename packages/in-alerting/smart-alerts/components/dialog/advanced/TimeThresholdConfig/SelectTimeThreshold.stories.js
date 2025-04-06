/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm } from 'formalistic';
import React, { useState } from 'react';

import SelectTimeThreshold from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/SelectTimeThreshold';
import { createViolationsInSequenceForm } from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';

export default {
  component: SelectTimeThreshold
};

export const Default = props => {
  const init = createMapForm().put('timeThreshold', createViolationsInSequenceForm({}, STATIC_THRESHOLD));

  let [form, updateForm] = useState(init);
  return <SelectTimeThreshold {...props} form={form} updateForm={updateForm} />;
};

Default.args = {
  hasTraceImpactOption: false,
  hasUserImpactOption: false,
  impactTimeThresholdDisabled: false
};
