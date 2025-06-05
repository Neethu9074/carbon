/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { InquiryResult, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { RadioButtonGroup } from '@instana/carbon';

import RadioButtonWithCount from 'in-service-levels/components/SloList/components/RadioButtonWithCount';
import { SloStatus } from 'in-service-levels/types';
import { t } from 'in-i18n';

interface SloStatusFilterProps {
  value: SloStatus | undefined;
  onChange: (value: SloStatus | '') => void;
  groups: InquiryResult<ServiceLevelObjectiveConfiguration> | undefined;
}

export default function SloStatusFilter({ value, onChange, groups }: SloStatusFilterProps) {
  const statusGroup = groups?.grouping?.status;
  const allCount =
    value === undefined ? Object.values(statusGroup ?? {}).reduce((total, count) => total + count, 0) : undefined;
  return (
    <RadioButtonGroup
      onChange={status => onChange(status as SloStatus | '')}
      valueSelected={value}
      name="slo-status-radio-button-group"
      orientation="vertical"
    >
      <RadioButtonWithCount
        labelText={t('in-service-levels:sloList.components.statusFilter.sloStatusAll')}
        value={undefined}
        count={allCount}
      />
      <RadioButtonWithCount
        labelText={t('in-service-levels:general.statuses.label', { context: 'green' })}
        value="green"
        count={statusGroup?.['Green']}
      />
      <RadioButtonWithCount
        labelText={t('in-service-levels:general.statuses.label', { context: 'red' })}
        value="red"
        count={statusGroup?.['Red']}
      />
    </RadioButtonGroup>
  );
}
