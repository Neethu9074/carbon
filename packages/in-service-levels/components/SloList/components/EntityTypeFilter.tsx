/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SloEntityType } from '@instana/types';

import ComboBox, { hasMultipleValuesSelected, Option } from 'in-components/ComboBox';
import { sloEntityTypes } from 'in-service-levels/constants';
import { t } from 'in-i18n';

interface EntityTypeFilterProps {
  value: SloEntityType | undefined;
  onChange: (value: SloEntityType | undefined) => void;
}

const options: Option[] = sloEntityTypes.map(entityType => ({
  value: entityType,
  label: t('in-service-levels:general.entityTypes.label', { context: entityType })
}));

export default function EntityTypeFilter({ value, onChange }: EntityTypeFilterProps) {
  return (
    <ComboBox
      options={options}
      placeholder={t('in-service-levels:sloList.components.entityTypeFilter.placeholder')}
      value={value}
      onChange={newValue => {
        if (!newValue) {
          onChange(undefined);
        } else if (hasMultipleValuesSelected(newValue)) {
          onChange(newValue[0].value as SloEntityType);
        } else {
          onChange(newValue.value as SloEntityType);
        }
      }}
    />
  );
}
