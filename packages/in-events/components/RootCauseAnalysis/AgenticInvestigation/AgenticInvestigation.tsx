/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { ProductiveCard } from '@carbon/ibm-products';
// eslint-disable-next-line no-restricted-imports
import { Stack, Tag } from '@carbon/react';
import React, { useMemo } from 'react';

import { Event, VolatileId } from '@instana/types';

import EntityDetails from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntityDetails';
import Topology from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/Topology';
import AutomationCardForPRC from 'in-automation/AutomationCard/AutomationCardForPRC';
import { EventOrMap } from 'in-events/types';

import locals from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/AgenticInvestigation.mless';

interface AgenticInvestigationProps {
  incident: EventOrMap;
  rcaRef: React.Ref<HTMLDivElement>;
  volatileId: VolatileId;
  event: Event;
}

// Using underscore prefix to indicate intentionally unused parameters
const AgenticInvestigation = ({ incident, volatileId, event }: AgenticInvestigationProps) => {
  const incidentJSON: Event = useMemo(() => incident.toJS(), [incident]);

  // Props are defined for future implementation but not used yet

  return (
    <div className={locals.investigateContainer}>
      <ProductiveCard
        title={
          <>
            Investigate <Tag type="green">Work in progress</Tag>
          </>
        }
        titleSize="large"
        description={
          'Explore the incident topology to see the triggering event and the probable root cause. You can also see recommended actions from watsonx or investigate the incident further.'
        }
      >
        <Stack gap={5} orientation="vertical">
          <Stack className={locals.innerCardsLayout} gap={5} orientation="horizontal">
            <EntityDetails />
            <Topology incident={incidentJSON} />
          </Stack>
        </Stack>

        <AutomationCardForPRC volatileId={volatileId} event={event} />
      </ProductiveCard>
    </div>
  );
};

export default AgenticInvestigation;
