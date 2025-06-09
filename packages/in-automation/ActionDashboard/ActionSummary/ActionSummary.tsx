/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Spacer } from '@instana/components';

import { averageExecutionTimeRefresh } from 'in-automation/ActionDashboard/ActionSummary/useActionAverageExecutionTime';
import { numberOfRunDataRefresh } from 'in-automation/ActionDashboard/ActionSummary/useActionNumberOfRunData';
import { actionSuccessRateRefresh } from 'in-automation/ActionDashboard/ActionSummary/useActionSuccessRate';
import ActionHistoryTable from 'in-automation/components/ActionHistory/ActionHistoryTable';
import SummaryCards from 'in-automation/ActionDashboard/ActionSummary/SummaryCards';
import PolicyTable from 'in-automation/PolicyTable/PolicyTable';
import { isAIAction } from 'in-automation/utils/action';
import { ACTION_TYPE } from 'in-automation/constants';
import { Action, Nullish } from 'in-types';
import { t } from 'in-i18n';

interface ActionSummaryProps {
  data: Action | Nullish;
}

export default function ActionSummary({ data }: Readonly<ActionSummaryProps>) {
  if (!data) return null;
  const isAIGeneratedAction = isAIAction(data);

  return (
    <>
      <SummaryCards data={data} />
      <Spacer size="small" vertical="large" />
      {![ACTION_TYPE.MANUAL, ACTION_TYPE.DOC_LINK].includes(data.type) && (
        <ActionHistoryTable
          title={t('in-automation:actionDashboard.history')}
          actionIds={[data.id]}
          noFilters
          actionHistoryDeleteCallback={actionHistoryDeleteCallback}
        />
      )}
      {!isAIGeneratedAction && (
        <PolicyTable actionId={data.id} hideFilters title={t('in-automation:actionDashboard.associatedPolicies')} />
      )}
    </>
  );
}

function actionHistoryDeleteCallback() {
  numberOfRunDataRefresh();
  averageExecutionTimeRefresh();
  actionSuccessRateRefresh();
}
