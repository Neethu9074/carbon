/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';
import AdvancedModeMaintenanceContainer from './components/AdvancedModeMaintenanceContainer';
import { stepConfigs, stepRenderers } from './components/simpleModeConfig';

export default function RecurrentMaintenanceConfigContainer({
  form,
  onChange,
  onChangeApplyOn,
  setForm,
  simpleMode,
  step,
  messages = []
}) {
  return simpleMode ? (
    <SimpleModeContainer
      form={form}
      onChange={onChange}
      onChangeApplyOn={onChangeApplyOn}
      setForm={setForm}
      stepConfigs={stepConfigs}
      stepRenderers={stepRenderers}
      step={step}
      messages={messages}
    />
  ) : (
    <AdvancedModeMaintenanceContainer
      form={form}
      onChange={onChange}
      onChangeApplyOn={onChangeApplyOn}
      setForm={setForm}
    />
  );
}
