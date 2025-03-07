/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonColumn, CarbonGrid, CarbonRow } from '@instana/components';
import { formatDate, formatTime } from '@instana/format-date';
import { Action } from '@instana/types';

import AverageExecutionKpiCard from 'in-automation/ActionDashboard/ActionSummary/AverageExecutionKpiCard';
import SuccessRateKipCard from 'in-automation/ActionDashboard/ActionSummary/SuccessRateKpiCard';
import NoOfRunKpiCard from 'in-automation/ActionDashboard/ActionSummary/NoOfRunKpiCard';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import { ACTION_TYPE, NO_FIELD_VALUE } from 'in-automation/constants';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import localStyles from 'in-automation/ActionDashboard/ActionSummary/ActionSummary.mless';
import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface SummaryCardsProps {
  data: Action | Nullish;
}

function SummaryCards({ data }: Readonly<SummaryCardsProps>) {
  const timeConfig = useTimeConfig();
  if (!data) return null;
  const { tags, modifiedAt } = data;
  const isFirstRowEnabled = data.type !== ACTION_TYPE.MANUAL;

  return (
    <CarbonRow>
      <CarbonGrid
        fullWidth
        className={classNames(localStyles.grid, local.noHorizontalPaddings, localStyles.customKPIStyle)}
        condensed
      >
        {isFirstRowEnabled && (
          <>
            <CarbonColumn sm={6} md={4}>
              <NoOfRunKpiCard
                actionId={data.id}
                title={t('in-automation:actionDashboard.noOfTimesRun')}
                timeConfig={timeConfig}
              />
            </CarbonColumn>
            <CarbonColumn sm={6} md={4}>
              <SuccessRateKipCard
                actionId={data.id}
                title={t('in-automation:actionDashboard.successRate')}
                timeConfig={timeConfig}
              />
            </CarbonColumn>
            <CarbonColumn sm={6} md={4}>
              <AverageExecutionKpiCard
                actionId={data.id}
                title={t('in-automation:actionDashboard.avgExecutionTime')}
                timeConfig={timeConfig}
              />
            </CarbonColumn>
            <CarbonColumn sm={6} md={4}>
              <KpiCard title={t('in-automation:parameters')} value={data?.inputParameters?.length} />
            </CarbonColumn>
          </>
        )}
        <CarbonColumn md={8}>
          <KpiCard title={t('in-automation:tags')}>
            {tags?.length ? <DynamicTagList tags={tags} /> : NO_FIELD_VALUE}
          </KpiCard>
        </CarbonColumn>
        <CarbonColumn md={8}>
          <KpiCard
            title={t('in-automation:actionDashboard.lastModified')}
            value={formatDate(+modifiedAt * 1000)}
            companionValue={`at ${formatTime(+modifiedAt * 1000)}`}
          />
        </CarbonColumn>
      </CarbonGrid>
    </CarbonRow>
  );
}

export default SummaryCards;
