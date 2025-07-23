/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { KeyValue, LoadingSkeleton } from '@instana/components';
import { Stack } from '@instana/carbon';

import { formatSloStatus, getSingleNumberMetricValue } from 'in-service-levels/utils/format';
import { useSloStatusMetrics } from 'in-service-levels/hooks/useSloListMetrics';
import { calculateSeverity } from 'in-service-levels/utils/math';
import HealthDot from 'in-components/health/HealthDot/HealthDot';
import type { SloListItem } from 'in-service-levels/types';
import { t } from 'in-i18n';

import locals from 'in-service-levels/styles/SloAlignContent.mless';

interface SloStatusColumnContentProps {
  item: SloListItem;
}

export default function SloStatusColumnContent({ item }: SloStatusColumnContentProps) {
  const { configuration } = item;
  const [statusMetrics, fetchStatus] = useSloStatusMetrics(configuration);
  const status = getSingleNumberMetricValue(statusMetrics);

  const { target } = configuration;

  const { sloStatus, sloTarget } = useMemo(() => formatSloStatus({ status, target }), [status, target]);

  if (fetchStatus === 'pending') {
    return <LoadingSkeleton className={locals.width100} />;
  }

  return (
    <Stack orientation="horizontal" gap="1rem" className={locals.stackAlignCenter}>
      {status != null && <HealthDot severity={calculateSeverity({ status, target })} />}
      <KeyValue
        label={t('in-service-levels:sloList.components.sloStatusColumnContent.target', {
          target: sloTarget
        })}
        value={sloStatus}
        inverted
      />
    </Stack>
  );
}
