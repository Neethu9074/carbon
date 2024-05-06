/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SeverityIndicatorCellContentWrapper } from '@instana/components';
import { Typography } from '@instana/components';

import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { calculateSeverity } from 'in-service-levels/utils/math';

interface Props {
  item: SloListItem;
}

export default function SloNameColumnContent({ item }: Props) {
  const { configuration, status } = item;
  const { name, target } = configuration;
  return (
    <SeverityIndicatorCellContentWrapper severity={status ? calculateSeverity({ status, target }) : undefined}>
      <Typography variant="body-regular">{name}</Typography>
    </SeverityIndicatorCellContentWrapper>
  );
}
