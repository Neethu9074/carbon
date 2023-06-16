/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { Card } from '@instana/components';

import { ApplicationSloForm, ApplicationSloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
import SloEntityTable, { EntityData } from 'in-service-levels/components/SloList/components/SloEntityTable';
import { useEntityConfigurations } from 'in-service-levels/hooks/useEntityConfigurations';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { t } from 'in-i18n';

interface SloApplicationEntitySectionProps {
  form: ApplicationSloForm;
  onChange: (path: ApplicationSloFormPath, updater: (i: Item) => Item) => void;
  onLabelChange: (label: string) => void;
}

export const SloApplicationEntitySection = ({ form, onChange, onLabelChange }: SloApplicationEntitySectionProps) => {
  const [query, setQuery] = useState('');

  const sloEntityTypeField = form.get('entityType');
  const applicationIdField = form.getIn(['entity', 'applicationId']);

  const [entityList, , , progress] = useEntityConfigurations(sloEntityTypeField.value);

  const onEntityChange = ({ id, label }: EntityData) => {
    onLabelChange(label);
    onChange(['entity', 'applicationId'], () => applicationIdField.setValue(id).setTouched(true));
  };

  return (
    <Card
      title={t('in-service-levels:general.select', { entity: sloEntityTypeField.value })}
      rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
    >
      <SloEntityTable form={form} entityList={entityList} onChange={onEntityChange} progress={progress} query={query} />
    </Card>
  );
};
