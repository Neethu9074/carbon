/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item } from 'formalistic';
import React, { useState } from 'react';

import { Typography } from '@instana/components';

import SloEntityTable, { EntityData } from 'in-service-levels/components/SloList/components/SloEntityTable';
import { useEntityConfigurations } from 'in-service-levels/hooks/useEntityConfigurations';
import { ApplicationSloForm } from 'in-service-levels/components/ConfigDialog/form';
import { t } from 'in-i18n';

interface SloApplicationEntitySectionProps {
  form: ApplicationSloForm;
  onChange: (path: string[], updater: (i: Item) => Item) => void;
}

export const SloApplicationEntitySection = ({ form, onChange }: SloApplicationEntitySectionProps) => {
  const [label, setLabel] = useState<string>();

  const sloEntityTypeField = form.get('entityType');

  const selectedLabel = label ?? t('in-service-levels:general.noSelection');

  const [entityList, , , progress] = useEntityConfigurations(sloEntityTypeField.value);

  const onEntityChange = ({ id, label }: EntityData) => {
    setLabel(label);
    onChange(['entity', 'applicationId'], field => (field as Field<string>).setValue(id).setTouched(true));
  };

  return (
    <>
      <Typography variant="heading-100" component="h3">
        {t('in-service-levels:general.selectLabel', { selectedLabel })}
      </Typography>
      <SloEntityTable form={form} entityList={entityList} onChange={onEntityChange} progress={progress} />
    </>
  );
};
