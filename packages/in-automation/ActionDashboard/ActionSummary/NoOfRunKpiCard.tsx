/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { ActionInstance, PaginatedResult, Result, TimeConfig } from '@instana/types';

import useActionNumberOfRunData from 'in-automation/ActionDashboard/ActionSummary/useActionNumberOfRunData';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import KpiCard from 'in-components/KpiCard/KpiCard';

interface NoOfRunKpiCardProps {
  actionId: string;
  title: string;
  timeConfig: TimeConfig;
}

function NoOfRunKpiCard(props: Readonly<NoOfRunKpiCardProps>) {
  const { actionId, title, timeConfig } = props;
  const result: Result<PaginatedResult<ActionInstance>> = useActionNumberOfRunData(timeConfig, actionId);
  return (
    <ResultAwareKpiCard
      title={title}
      result={result}
      renderKpiCard={result => {
        let kpiValue: number | undefined = result?.data?.totalHits;
        return <KpiCard title={title} value={kpiValue} />;
      }}
    />
  );
}

export default NoOfRunKpiCard;
