/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import SloConfigSection, {
  RowDefinition,
  SloConfigSectionData
} from 'in-service-levels/components/SloDashboard/components/configuration/SloConfigSection';
import { t } from 'in-i18n';

interface EntitySectionProps {
  data: SloConfigSectionData;
}

const contentDefinitions: RowDefinition[] = [
  {
    id: 'entity',
    columns: [{ getContent: EntityTypeColumn }, { getContent: EntityLabelColumn }]
  }
];

export default function EntitySection({ data }: EntitySectionProps) {
  return (
    <SloConfigSection
      data={data}
      label={t('in-service-levels:sloDashboard.components.entitySection.title')}
      contentDefinitions={contentDefinitions}
    />
  );
}

function EntityTypeColumn({ data }: EntitySectionProps) {
  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.entitySection.typeLabel')}
      value={t('in-service-levels:general.entityTypes.label', { context: data.configuration.entity.type })}
    />
  );
}

function EntityLabelColumn({ data }: EntitySectionProps) {
  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.entitySection.nameLabel')}
      value={data.entities.map(({ label }) => label).join(', ')}
    />
  );
}
