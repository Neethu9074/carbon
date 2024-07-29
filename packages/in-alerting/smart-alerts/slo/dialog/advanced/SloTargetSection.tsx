/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import SloEntityTypeSelector from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTypeSelector';
import SloListSelection from 'in-alerting/smart-alerts/slo/components/SloListSelection/SloListSelection';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';

export default function SloTargetSection() {
  const { form, onChange } = useSloAlertFormContext();

  const entityTypeField = form.getIn(['entityType']);

  return (
    <>
      <SloEntityTypeSelector
        onChange={entityType => {
          onChange(['entityType'], () => entityTypeField.setValue(entityType).setTouched(true));
        }}
        value={entityTypeField.value ?? 'application'}
        disabled={entityTypeField.value == null}
      />

      <SloListSelection />
    </>
  );
}
