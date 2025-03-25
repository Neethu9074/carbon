/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonColumn, CarbonGrid, CarbonRow } from '@instana/components';
import { formatDate, formatTime } from '@instana/format-date';

import AverageExecutionKpiCard from 'in-automation/ActionDashboard/ActionSummary/AverageExecutionKpiCard';
import SuccessRateKipCard from 'in-automation/ActionDashboard/ActionSummary/SuccessRateKpiCard';
import NoOfRunKpiCard from 'in-automation/ActionDashboard/ActionSummary/NoOfRunKpiCard';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';
import { ACTION_TYPE, NO_FIELD_VALUE } from 'in-automation/constants';
import KpiCard from 'in-components/KpiCard/KpiCard';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Nullish, Action } from 'in-types';
import { t } from 'in-i18n';

import localStyles from 'in-automation/ActionDashboard/ActionSummary/ActionSummary.mless';
import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface SummaryCardsProps {
  data: Action | Nullish;
}

function SummaryCards({ data }: Readonly<SummaryCardsProps>) {
  const timeConfig = useTimeConfig();
  if (!data) return null;
  const { id, type, tags, modifiedAt } = data;
  const isFirstRowEnabled = ![ACTION_TYPE.DOC_LINK, ACTION_TYPE.MANUAL].includes(type);
  const cards = [
    {
      cardId: 'card-1',
      renderCard: () => (
        <NoOfRunKpiCard actionId={id} title={t('in-automation:actionDashboard.noOfTimesRun')} timeConfig={timeConfig} />
      )
    },
    {
      cardId: 'card-1',
      renderCard: () => (
        <SuccessRateKipCard
          actionId={id}
          title={t('in-automation:actionDashboard.successRate')}
          timeConfig={timeConfig}
        />
      )
    },
    {
      cardId: 'card-1',
      renderCard: () => (
        <AverageExecutionKpiCard
          actionId={id}
          title={t('in-automation:actionDashboard.avgExecutionTime')}
          timeConfig={timeConfig}
        />
      )
    },
    {
      cardId: 'card-1',
      renderCard: () => <KpiCard title={t('in-automation:parameters')} value={data?.inputParameters?.length} />
    }
  ];

  return (
    <CarbonRow>
      <CarbonGrid
        fullWidth
        className={classNames(localStyles.grid, local.noHorizontalPaddings, localStyles.customKPIStyle)}
        condensed
      >
        {isFirstRowEnabled &&
          cards.map(card => (
            <CarbonColumn key={card.cardId} sm={6} md={4}>
              {card.renderCard()}
            </CarbonColumn>
          ))}
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
            minorClass={localStyles.customKPIMinor}
          />
        </CarbonColumn>
      </CarbonGrid>
    </CarbonRow>
  );
}

export default SummaryCards;
