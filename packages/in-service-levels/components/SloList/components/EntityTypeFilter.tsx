/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { InquiryResult, ServiceLevelObjectiveConfiguration, SloEntityType } from '@instana/types';
import { RadioButtonGroup } from '@instana/carbon';

import RadioButtonWithCount from 'in-service-levels/components/SloList/components/RadioButtonWithCount';
import { sloEntityTypes } from 'in-service-levels/constants';
import { t } from 'in-i18n';

interface EntityTypeFilterProps {
  value: SloEntityType | undefined;
  onChange: (value: SloEntityType | '') => void;
  groups: InquiryResult<ServiceLevelObjectiveConfiguration> | undefined;
}

export default function EntityTypeFilter({ value, onChange, groups }: EntityTypeFilterProps) {
  const entityTypeGroup = groups?.grouping?.entityType;
  const allCount =
    value === undefined ? Object.values(entityTypeGroup ?? {}).reduce((total, count) => total + count, 0) : undefined;
  return (
    <RadioButtonGroup
      onChange={entityType => onChange(entityType as SloEntityType | '')}
      valueSelected={value}
      name="slo-entity-type-radio-button-group"
      orientation="vertical"
    >
      <RadioButtonWithCount labelText={t('in-service-levels:general.all')} value={undefined} count={allCount} />
      {sloEntityTypes.map(entityType => (
        <RadioButtonWithCount
          key={entityType}
          labelText={t('in-service-levels:general.entityTypes.label', { context: entityType })}
          value={entityType}
          count={entityTypeGroup?.[entityType]}
        />
      ))}
    </RadioButtonGroup>
  );
}
