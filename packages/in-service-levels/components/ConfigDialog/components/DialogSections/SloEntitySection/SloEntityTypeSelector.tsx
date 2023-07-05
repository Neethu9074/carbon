/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SloEntityType } from '@instana/types';
import { Stack } from '@instana/components';

import ButtonGroup from 'in-components/ButtonGroup/ButtonGroup';
import { sloEntityTypes } from 'in-service-levels/constants';
import { t } from 'in-i18n';

export interface SloEntityTypeSelectorProps {
  value: SloEntityType;
  onChange: (v: SloEntityType) => void;
}

export default function SloEntityTypeSelector({ value, onChange }: SloEntityTypeSelectorProps) {
  return (
    <Stack gap="xxsmall">
      <ButtonGroup
        buttonPropsList={sloEntityTypes.map(value => ({
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
