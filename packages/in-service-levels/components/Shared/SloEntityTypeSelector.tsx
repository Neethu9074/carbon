/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ButtonGroup, Stack } from '@instana/components';
import type { SloEntityType } from '@instana/types';

import { getSloEntityTypes } from 'in-service-levels/utils/sloConfig';
import { syntheticsAccessPermissions } from 'in-stores/permission';
import { syntheticsEnabled } from 'in-services/featureFlags';
import useHasAccess from 'in-stores/useHasAccess';
import { t } from 'in-i18n';

export interface SloEntityTypeSelectorProps {
  disabled?: boolean;
  onChange: (v: SloEntityType) => void;
  value: SloEntityType;
}

export default function SloEntityTypeSelector({ disabled = false, onChange, value }: SloEntityTypeSelectorProps) {
  const hasSyntheticsAccess = useHasAccess({
    optionalPrecondition: syntheticsEnabled,
    requiredPermissions: syntheticsAccessPermissions
  });
  return (
    <Stack gap="xxsmall">
      <ButtonGroup
        buttonPropsList={getSloEntityTypes(hasSyntheticsAccess).map(value => ({
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
