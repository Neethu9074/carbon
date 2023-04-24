/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SeverityIndicatorCellContentWrapper } from '@instana/components';
import { Typography } from '@instana/components';

import { SloListItem } from 'in-service-levels/components/SloList/SloList';

interface Props {
  item: SloListItem;
}

export default function SloNameColumnContent({ item }: Props) {
  const { configuration, status } = item;
  const { name, target } = configuration;
  return (
    <SeverityIndicatorCellContentWrapper severity={calculateSeverity(status, target)}>
      <Typography variant="body-regular">{name}</Typography>
    </SeverityIndicatorCellContentWrapper>
  );
}

// The SeverityIndicator treats severity as follows:
// s === 0 => green
// 0 < s < 5 => yellow
// s >= 5 => red
function calculateSeverity(status: number, target: number): number {
  if (status <= target) {
    return 0;
  } else {
    return 10;
  }
}
