/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import { AvailableEntityTypes, SloEntityTypes } from 'in-service-levels/types';
import ButtonGroup from 'in-components/ButtonGroup/ButtonGroup';
import { t } from 'in-i18n';

export interface SloEntityTypeSelectorProps {
  value: SloEntityTypes;
  onChange: (v: SloEntityTypes) => void;
}

export default function SloEntityTypeSelector({ value, onChange }: SloEntityTypeSelectorProps) {
  return (
    <Stack gap="xxsmall">
      <ButtonGroup
        buttonPropsList={AvailableEntityTypes.map(value => ({
          key: value,
          text: t('in-service-levels:general.entityTypes.label', { context: value }),
          onClick: () => onChange(value)
        }))}
        activeKey={value}
        segmented
      />
    </Stack>
  );
}
