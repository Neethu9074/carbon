/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { SloEntityType } from '@instana/types';
import { useObservable } from '@instana/hooks';

import SloEntityTypeSelector from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTypeSelector';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import SloListSelection from 'in-alerting/smart-alerts/slo/components/SloListSelection';
import { getSloConfiguration } from 'in-service-levels/api/configuration';

interface SloTargetSectionProps {
  setTargetData: (data: SloEntityType) => void;
}
export default function SloTargetSection({ setTargetData }: SloTargetSectionProps) {
  const { mode, form } = useSloAlertFormContext();
  const sloId = form.getIn(['sloIds']).value[0];
  const sloConfig = useObservable(() => {
    return getSloConfiguration(sloId);
  }, [sloId]);
  const sloEntity = sloConfig?.data?.entity.type;
  let hasSloId = sloEntity ?? 'application';

  const [entity, setEntity] = useState(hasSloId as SloEntityType);
  const editMode = mode === 'EDIT';

  return (
    <>
      {!editMode && (
        <SloEntityTypeSelector
          onChange={type => {
            setEntity(type);
            setTargetData(type);
          }}
          value={entity}
        />
      )}

      <SloListSelection entity={hasSloId} />
    </>
  );
}
