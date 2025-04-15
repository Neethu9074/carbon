/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Link } from '@instana/components';

import { SeverityIndicatorCellContentWrapper } from 'in-components/tables/ServerTable/internalComponents/LegacySeverityIndicatorCellContentWrapper';
import useGetHrefToSloDashboard from 'in-service-levels/navigation/hooks/useGetHrefToSloDashboard';
import { SloListItem } from 'in-service-levels/components/SloList/SloList';
import { calculateSeverity } from 'in-service-levels/utils/math';
import Tooltip from 'in-components/Tooltip/Tooltip';

interface Props {
  item: SloListItem;
}

export default function SloNameColumnContent({ item }: Props) {
  const hrefToSloDashboard = useGetHrefToSloDashboard();

  const { configuration, status } = item;
  const { name, target, id } = configuration;
  return (
    <SeverityIndicatorCellContentWrapper severity={status != null ? calculateSeverity({ status, target }) : undefined}>
      <Tooltip overflowEllipsis content={name}>
        <Link href={hrefToSloDashboard(id!)}>{name}</Link>
      </Tooltip>
    </SeverityIndicatorCellContentWrapper>
  );
}
