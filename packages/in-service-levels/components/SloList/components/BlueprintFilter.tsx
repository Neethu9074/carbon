/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { BlueprintType, InquiryResult, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { RadioButtonGroup } from '@instana/carbon';

import RadioButtonWithCount from 'in-service-levels/components/SloList/components/RadioButtonWithCount';
import { t } from 'in-i18n';

interface BlueprintFilterProps {
  value: BlueprintType | undefined;
  onChange: (value: BlueprintType | '') => void;
  groups: InquiryResult<ServiceLevelObjectiveConfiguration> | undefined;
}

export default function BlueprintFilter({ value, onChange, groups }: BlueprintFilterProps) {
  const blueprintGroup = groups?.grouping?.blueprint;
  const allCount =
    value === undefined ? Object.values(blueprintGroup ?? {}).reduce((total, count) => total + count, 0) : undefined;

  return (
    <RadioButtonGroup
      onChange={blueprint => onChange(blueprint as BlueprintType | '')}
      valueSelected={value}
      name="slo-blueprint-radio-button-group"
      orientation="vertical"
    >
      <RadioButtonWithCount labelText={t('in-service-levels:general.all')} value={undefined} count={allCount} />
      <RadioButtonWithCount
        labelText={t('in-service-levels:general.indicator.blueprint', { context: 'availability' })}
        value="availability"
        count={blueprintGroup?.['availability']}
      />
      <RadioButtonWithCount
        labelText={t('in-service-levels:general.indicator.blueprint', { context: 'custom' })}
        value="custom"
        count={blueprintGroup?.['custom']}
      />
      <RadioButtonWithCount
        labelText={t('in-service-levels:general.indicator.blueprint', { context: 'latency' })}
        value="latency"
        count={blueprintGroup?.['latency']}
      />
      <RadioButtonWithCount
        labelText={t('in-service-levels:general.indicator.blueprint', { context: 'traffic' })}
        value="traffic"
        count={blueprintGroup?.['traffic']}
      />
    </RadioButtonGroup>
  );
}
