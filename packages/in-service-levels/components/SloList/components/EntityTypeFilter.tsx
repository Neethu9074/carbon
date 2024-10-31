/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SloEntityType } from '@instana/types';
import { t } from '@instana/i18n-react';

import ComboBox, { hasMultipleValuesSelected, Option } from 'in-components/ComboBox';
import { sloEntityTypes } from 'in-service-levels/constants';

interface Props {
  value: SloEntityType | undefined;
  onChange: (value: SloEntityType | undefined) => void;
  disabled?: boolean;
}

const options: Option[] = sloEntityTypes.map(entityType => ({
  value: entityType,
  label: t('in-service-levels:general.entityTypes.label', { context: entityType })
}));

export default function EntityTypeFilter({ value, onChange, disabled }: Props) {
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
      disabled={disabled}
    />
  );
}
