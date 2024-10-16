/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import SloExpandedErrorBudgetChart from 'in-service-levels/components/Shared/SloExpandedErrorBudgetChart';
import useSloAlertConfig from 'in-alerting/smart-alerts/slo/hooks/useSloAlertConfig';
import DescriptionButtons from 'in-events/components/legacy/DescriptionButtons';
import ProblemDescription from 'in-events/components/legacy/ProblemDescription';
import AnalyzeSloEventButton from 'in-events/components/AnalyzeSloEventButton';
import SloAlertConfigButton from 'in-events/components/SloAlertConfigButton';
import useSloEventEntity from 'in-events/hooks/useSloEventEntity';
import { getTimeConfigFromEvent } from 'in-events/timeframe';
import { EventOrMap } from 'in-events/types';

import locals from './EventListItemContent.mless';

interface SloEventListItemContentProps {
  event: EventOrMap;
  justChart?: boolean;
}

export default function SloEventListItemContent({ event, justChart = false }: SloEventListItemContentProps) {
  const timeConfig = getTimeConfigFromEvent(event);
  const configId = event.getIn(['metadata', 'eventSpecificationId']);
  const fixSuggestion = event.getIn(['problem', 'fixSuggestion'], '');

  const eventEntity = useSloEventEntity(event);
  const [alertConfig] = useSloAlertConfig({ id: configId });

  if (!eventEntity || !alertConfig) return <></>;

  return (
    <>
      {!justChart && (
        <>
          <ProblemDescription fixSuggestion={fixSuggestion} />
          <DescriptionButtons>
            <SloAlertConfigButton sloId={eventEntity.sloConfig.id!} alertConfig={alertConfig} />
            <AnalyzeSloEventButton sloConfig={eventEntity.sloConfig} timeConfig={timeConfig} />
          </DescriptionButtons>
        </>
      )}
      <div className={locals.sectionWrapper}>
        <SloExpandedErrorBudgetChart sloConfig={eventEntity.sloConfig} timeConfig={timeConfig} />
      </div>
    </>
  );
}
