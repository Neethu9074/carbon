/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { Item } from 'formalistic';

import { Card } from '@instana/components';

import { WebsiteSloForm, WebsiteSloFormPath } from 'in-service-levels/components/ConfigDialog/createSloForm';
import SloEntityTable, { EntityData } from 'in-service-levels/components/SloList/components/SloEntityTable';
import { useEntityConfigurations } from 'in-service-levels/hooks/useEntityConfigurations';
import SearchInput from 'in-components/SearchInput/SearchInput';
import { t } from 'in-i18n';

interface SloWebsiteEntitySectionProps {
  form: WebsiteSloForm;
  onChange: (path: WebsiteSloFormPath, updater: (i: Item) => Item) => void;
  onLabelChange: (label: string) => void;
}

export const SloWebsiteEntitySection = ({ form, onChange, onLabelChange }: SloWebsiteEntitySectionProps) => {
  const [query, setQuery] = useState('');

  const entityTypeField = form.get('entityType');
  const websiteIdField = form.getIn(['entity', 'websiteId']);

  const [entityList, , , progress] = useEntityConfigurations(entityTypeField.value);

  const onEntityChange = ({ id, label }: EntityData) => {
    onLabelChange(label);
    onChange(['entity', 'websiteId'], () => websiteIdField.setValue(id).setTouched(true));
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
