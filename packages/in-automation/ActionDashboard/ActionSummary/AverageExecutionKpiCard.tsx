/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Result, TimeConfig } from '@instana/types';

import useActionAverageExecutionTime from 'in-automation/ActionDashboard/ActionSummary/useActionAverageExecutionTime';
import { ActionAverageExecutionResult } from 'in-automation/subscriptions/getActionAvgExecutionTime';
import ResultAwareKpiCard from 'in-components/KpiCard/ResultAwareKpiCard';
import KpiCard from 'in-components/KpiCard/KpiCard';
import { t } from 'in-i18n';

interface AverageExecutionKpiCardProps {
  actionId: string;
  title: string;
  timeConfig: TimeConfig;
}

function AverageExecutionKpiCard(props: Readonly<AverageExecutionKpiCardProps>) {
  const { actionId, title, timeConfig } = props;
  const result: Result<ActionAverageExecutionResult> = useActionAverageExecutionTime(timeConfig, actionId);
  return (
    <ResultAwareKpiCard
      title={title}
      result={result}
      renderKpiCard={result => {
        const kpiValue: number | undefined = result?.data?.avgExecutionTime;
        return (
          <KpiCard
            title={title}
            value={kpiValue}
            companionValue={t('in-automation:actionDashboard.summaryTab.seconds')}
          />
        );
      }}
    />
  );
}

export default AverageExecutionKpiCard;
