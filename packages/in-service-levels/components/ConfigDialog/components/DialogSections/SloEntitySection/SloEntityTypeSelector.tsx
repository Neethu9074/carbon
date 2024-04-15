/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ButtonGroup } from '@instana/components';
import { SloEntityType } from '@instana/types';
import { Stack } from '@instana/components';

import { sloEntityTypes } from 'in-service-levels/constants';
import { t } from 'in-i18n';

export interface SloEntityTypeSelectorProps {
  disabled?: boolean;
  onChange: (v: SloEntityType) => void;
  value: SloEntityType;
}

export default function SloEntityTypeSelector({ disabled = false, onChange, value }: SloEntityTypeSelectorProps) {
  return (
    <Stack gap="xxsmall">
      <ButtonGroup
        buttonPropsList={sloEntityTypes.map(value => ({
          disabled,
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
