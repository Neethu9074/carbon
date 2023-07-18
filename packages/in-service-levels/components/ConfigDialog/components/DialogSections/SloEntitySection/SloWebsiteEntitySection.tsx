/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

import SloEntityTable, {
  EntityData
} from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloEntitySection/SloEntityTable';
import { SloForm, SloFormOnChange } from 'in-service-levels/components/ConfigDialog/createSloForm';
import { useEntityConfigurations } from 'in-service-levels/hooks/useEntityConfigurations';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { t } from 'in-i18n';

interface SloWebsiteEntitySectionProps {
  form: SloForm;
  onChange: SloFormOnChange;
  onLabelChange: (label: string) => void;
}

export const SloWebsiteEntitySection = ({ form, onChange, onLabelChange }: SloWebsiteEntitySectionProps) => {
  const [query, setQuery] = useState('');

  const entityTypeField = form.getIn(['entity', 'type']);
  const websiteIdField = form.getIn(['entity', 'entityId']);

  const [entityList, , , progress] = useEntityConfigurations(entityTypeField.value);

  const onEntityChange = ({ id, label }: EntityData) => {
    onLabelChange(label);
    onChange(['entity', 'entityId'], () => websiteIdField.setValue(id).setTouched(true));
  };

  return (
    <Card
      title={t('in-service-levels:general.select', { entity: entityTypeField.value })}
      rightHeaderContent={<SearchInput query={query} onChange={q => setQuery(q)} />}
    >
      <SloEntityTable form={form} entityList={entityList} onChange={onEntityChange} progress={progress} query={query} />
    </Card>
  );
};
