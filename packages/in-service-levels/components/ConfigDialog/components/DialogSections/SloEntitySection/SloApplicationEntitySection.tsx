/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { Card } from '@instana/components';

import SloEntityTable, {
  EntityData
} from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import { SloForm, SloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { useEntityConfigurations } from 'in-service-levels/hooks/useEntityConfigurations';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { t } from 'in-i18n';

interface SloApplicationEntitySectionProps {
  form: SloForm;
  onChange: (path: SloFormPath, updater: (i: Item) => Item) => void;
  onLabelChange: (label: string) => void;
}

export const SloApplicationEntitySection = ({ form, onChange, onLabelChange }: SloApplicationEntitySectionProps) => {
  const [query, setQuery] = useState('');

  const sloEntityTypeField = form.getIn(['entity', 'type']);
  const entityIdField = form.getIn(['entity', 'entityId']);

  const [entityList, , , progress] = useEntityConfigurations(sloEntityTypeField.value);

  const onEntityChange = ({ id, label }: EntityData) => {
    onLabelChange(label);
    onChange(['entity', 'entityId'], () => entityIdField.setValue(id).setTouched(true));
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
