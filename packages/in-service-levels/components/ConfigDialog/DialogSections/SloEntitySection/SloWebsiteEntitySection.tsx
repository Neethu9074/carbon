/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item } from 'formalistic';
import React from 'react';

import SloEntityTable from 'in-service-levels/components/SloList/components/SloEntityTable';
import { EntityData } from 'in-service-levels/components/SloList/components/SloEntityTable';
import { useEntityConfigurations } from 'in-service-levels/hooks/useEntityConfigurations';
import { WebsiteSloForm } from 'in-service-levels/components/ConfigDialog/form';

interface SloWebsiteEntitySectionProps {
  form: WebsiteSloForm;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
  onLabelChange: (label: string) => void;
}

export const SloWebsiteEntitySection = ({ form, onChange, onLabelChange }: SloWebsiteEntitySectionProps) => {
  const sloEntityTypeField = form.get('entityType');

  const [entityList, , , progress] = useEntityConfigurations(sloEntityTypeField.value);

  const onEntityChange = ({ id, label }: EntityData) => {
    onLabelChange(label);
    onChange(['entity', 'websiteId'], field => (field as Field<string>).setValue(id).setTouched(true));
  };

  return <SloEntityTable form={form} entityList={entityList} onChange={onEntityChange} progress={progress} />;
};
