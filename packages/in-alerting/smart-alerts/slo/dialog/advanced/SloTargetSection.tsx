/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item } from 'formalistic';
import React from 'react';

import SloListSelection from 'in-service-levels/components/Shared/SloListSelection/SloListSelection';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import SloEntityTypeSelector from 'in-service-levels/components/Shared/SloEntityTypeSelector';

export default function SloTargetSection() {
  const { form, onChange } = useSloAlertFormContext();

  const sloIdsField = form.getIn(['sloIds']);
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

      <SloListSelection
        entityTypeField={entityTypeField}
        sloIdsField={sloIdsField}
        onChange={(item: Item) => onChange(['sloIds'], () => item)}
      />
    </>
  );
}
