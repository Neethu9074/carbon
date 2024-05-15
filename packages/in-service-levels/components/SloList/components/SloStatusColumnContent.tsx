/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import { KeyValue, Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { formatSloStatus } from 'in-service-levels/utils/format';
import { calculateSeverity } from 'in-service-levels/utils/math';
import HealthDot from 'in-components/health/HealthDot';

interface SloStatusColumnContentProps {
  item: SloListItem;
}

export default function SloStatusColumnContent({ item }: SloStatusColumnContentProps) {
  const { configuration, status } = item;
  const { target } = configuration;

  const { sloStatus, sloTarget } = useMemo(() => formatSloStatus({ status, target }), [status, target]);

  return (
    <Stack direction="horizontal" align="center">
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
