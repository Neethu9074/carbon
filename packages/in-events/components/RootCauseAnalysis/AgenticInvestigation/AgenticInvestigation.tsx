/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { ContentSwitcher, Switch, Grid, Column, Stack } from '@carbon/react';
// eslint-disable-next-line no-restricted-imports
import { ProductiveCard } from '@carbon/ibm-products';
import React, { useMemo, useState } from 'react';

import { Event, VolatileId } from '@instana/types';

import SingleEntityLLM from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/SingleEntityLLM/SingleEntityLLM';
import NewTopology from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/NewTopology/NewTopology';
import gridSettings from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/utils/gridSettings';
import EntityDetails from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/EntityDetails';
import Topology from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/Topology';
import AutomationCardForPRC from 'in-automation/AutomationCard/AutomationCardForPRC';
import { newTopologyEnabled } from 'in-services/featureFlags';
import { EventOrMap } from 'in-events/types';
import { t } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/AgenticInvestigation.mless';

interface AgenticInvestigationProps {
  incident: EventOrMap;
  rcaRef: React.Ref<HTMLDivElement>;
  volatileId: VolatileId;
  event: Event;
}

const AgenticInvestigation = ({ incident, volatileId, event }: AgenticInvestigationProps) => {
  const incidentJSON: Event = useMemo(() => incident.toJS(), [incident]);

  const [indexForSwitch, setIndexForSwitch] = useState(0);

  return (
    <div className={locals.investigateContainer}>
      <ProductiveCard
        title={t('in-events:RCA.singleEntityLLM.mainContainerTitle')}
        titleSize="large"
        description={t('in-events:RCA.singleEntityLLM.mainContainerSubtitle')}
      >
        <Stack gap={5}>
          <Grid narrow className={locals.grid} fullWidth>
            <Column {...gridSettings.left}>
              <EntityDetails />
            </Column>
            <Column {...gridSettings.right}>
              {newTopologyEnabled && <NewTopology incident={incidentJSON} />}
              <Topology incident={incidentJSON} />
            </Column>
          </Grid>

          <ContentSwitcher
            selectedIndex={indexForSwitch}
            size="sm"
            onChange={({ index }) => setIndexForSwitch(index || 0)}
          >
            <Switch name="automation" text={t('in-events:RCA.singleEntityLLM.switcher.automation')} />
            <Switch name="investigation" text={t('in-events:RCA.singleEntityLLM.switcher.investigation')} />
          </ContentSwitcher>

          {indexForSwitch === 0 && <AutomationCardForPRC volatileId={volatileId} event={event} />}
          {indexForSwitch === 1 && <SingleEntityLLM volatileId={volatileId} event={event} />}
        </Stack>
      </ProductiveCard>
    </div>
  );
};

export default AgenticInvestigation;
