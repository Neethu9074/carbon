/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AdvancedModeMaintenanceContainer from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/AdvancedModeMaintenanceContainer';
import {
  stepConfigs,
  stepRenderers
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/simpleModeConfig';
import SimpleModeContainer from 'in-alerting/smart-alerts/components/dialog/simple/SimpleModeContainer';

export default function RecurrentMaintenanceConfigContainer({
  form,
  entity,
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
      entity={entity}
    />
  ) : (
    <AdvancedModeMaintenanceContainer
      form={form}
      onChange={onChange}
      onChangeApplyOn={onChangeApplyOn}
      setForm={setForm}
      entity={entity}
    />
  );
}
