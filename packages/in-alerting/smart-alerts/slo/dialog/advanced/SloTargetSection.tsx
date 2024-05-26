/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { SloEntityType } from '@instana/types';

import SloEntityTypeSelector from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTypeSelector';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import SloListSelection from 'in-alerting/smart-alerts/slo/components/SloListSelection';

interface SloTargetSectionProps {
  setTargetData: (data: SloEntityType) => void;
}
export default function SloTargetSection({ setTargetData }: SloTargetSectionProps) {
  const { mode } = useSloAlertFormContext();

  const [entity, setEntity] = useState('application' as SloEntityType);
  const editMode = mode === 'NEW';
  return (
    <>
      {editMode && (
        <SloEntityTypeSelector
          onChange={type => {
            setEntity(type);
            setTargetData(type);
          }}
          value={entity}
        />
      )}

      <SloListSelection entity={entity} />
    </>
  );
}
