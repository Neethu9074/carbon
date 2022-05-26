/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { Stack } from '@instana/components';

import { ApdexEntityTypes, AvailableEntityTypes } from 'in-custom-dashboards/widgets/Apdex/apdexTypes';
import ButtonGroup from 'in-components/ButtonGroup/ButtonGroup';
import { t } from 'in-i18n';

export interface EntityTypeSelectorProps {
  value: ApdexEntityTypes;
  onChange: (v: ApdexEntityTypes) => void;
}

export default function EntityTypeSelector({ value, onChange }: EntityTypeSelectorProps) {
  return (
    <Stack gap="xxsmall">
      <ButtonGroup
        buttonPropsList={AvailableEntityTypes.map(apdexType => ({
          key: apdexType,
          text: t('in-custom-dashboards:widgets.apdex.entityTypeSelector.type', { context: apdexType }),
          onClick: () => onChange(apdexType)
        }))}
        activeKey={value}
        segmented
      />
    </Stack>
  );
}
