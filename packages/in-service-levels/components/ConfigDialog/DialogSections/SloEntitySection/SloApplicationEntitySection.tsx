/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item } from 'formalistic';
import React from 'react';

import SloEntityTable, { EntityData } from 'in-service-levels/components/SloList/components/SloEntityTable';
import { useEntityConfigurations } from 'in-service-levels/hooks/useEntityConfigurations';
import { ApplicationSloForm } from 'in-service-levels/components/ConfigDialog/form';

interface SloApplicationEntitySectionProps {
  form: ApplicationSloForm;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
  onLabelChange: (label: string) => void;
}

export const SloApplicationEntitySection = ({ form, onChange, onLabelChange }: SloApplicationEntitySectionProps) => {
  const sloEntityTypeField = form.get('entityType');

  const [entityList, , , progress] = useEntityConfigurations(sloEntityTypeField.value);

  const onEntityChange = ({ id, label }: EntityData) => {
    onLabelChange(label);
    onChange(['entity', 'applicationId'], field => (field as Field<string>).setValue(id).setTouched(true));
  };

  return (
    <>
      <SloEntityTable form={form} entityList={entityList} onChange={onEntityChange} progress={progress} />
    </>
  );
};
