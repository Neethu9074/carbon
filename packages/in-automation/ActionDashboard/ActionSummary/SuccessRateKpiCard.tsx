/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Result, TimeConfig } from '@instana/types';

import useActionSuccessRate from 'in-automation/ActionDashboard/ActionSummary/useActionSuccessRate';
import { ActionSuccessRateResult } from 'in-automation/subscriptions/getActionSuccessRate';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import KpiCard from 'in-components/KpiCard/KpiCard';

interface SuccessRateCardProps {
  actionId: string;
  title: string;
  timeConfig: TimeConfig;
}

function SuccessRateKpiCard(props: Readonly<SuccessRateCardProps>) {
  const { actionId, title, timeConfig } = props;
  const result: Result<ActionSuccessRateResult> = useActionSuccessRate(timeConfig, actionId);
  return (
    <ResultAwareKpiCard
      title={title}
      result={result}
      renderKpiCard={result => {
        const kpiValue: number | undefined = result?.data?.successCount;
        return <KpiCard title={title} value={kpiValue} companionValue={`/${result?.data?.total}`} />;
      }}
    />
  );
}

export default SuccessRateKpiCard;
