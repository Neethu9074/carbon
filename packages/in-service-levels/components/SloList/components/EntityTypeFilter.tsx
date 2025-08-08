/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import type { InquiryResult, ServiceLevelObjectiveConfiguration, SloEntityType } from '@instana/types';
import { RadioButtonGroup } from '@instana/carbon';

import RadioButtonWithCount from 'in-service-levels/components/SloList/components/RadioButtonWithCount';
import { getSloEntityTypes } from 'in-service-levels/utils/sloConfig';
import { syntheticsAccessPermissions } from 'in-stores/permission';
import { syntheticsEnabled } from 'in-services/featureFlags';
import useHasAccess from 'in-stores/useHasAccess';
import { t } from 'in-i18n';

interface EntityTypeFilterProps {
  value: SloEntityType | undefined;
  onChange: (value: SloEntityType | '') => void;
  groups: InquiryResult<ServiceLevelObjectiveConfiguration> | undefined;
}

export default function EntityTypeFilter({ value, onChange, groups }: EntityTypeFilterProps) {
  const hasSyntheticsAccess = useHasAccess({
    optionalPrecondition: syntheticsEnabled,
    requiredPermissions: syntheticsAccessPermissions
  });
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
      {getSloEntityTypes(hasSyntheticsAccess).map(entityType => (
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
