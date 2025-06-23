/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// eslint-disable-next-line no-restricted-imports
import { ErrorEmptyState, ProductiveCard } from '@carbon/ibm-products';
// eslint-disable-next-line no-restricted-imports
import { DataClass, ZoomIn, ZoomOut } from '@carbon/icons-react';
import React, { memo } from 'react';
import { get } from 'lodash';

import { LoadingSpinner } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';
import { Event } from '@instana/types';

import {
  RCATopologyAPContext,
  RCATopologyTimeWindowContext
} from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopologyDialog';
import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import getIncidentTimeConfig from 'in-events/components/RootCauseAnalysis/utils/getIncidentTimeConfig';
import RootCauseTopology from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopology';
import getApplication from 'in-applications/subscriptions/getApplication';

import locals from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/AgenticInvestigation.mless';

interface TopologyProps {
  incident: Event;
}

const Topology = ({ incident }: TopologyProps) => {
  // GET AP
  const relatedAPID = get(incident, 'metadata.app20ApplicationId', null);
  const relatedAPInfo = useObservable(
    relatedAPID
      ? getApplication({ id: relatedAPID })
          .map((d: any) => d.data)
          .throttle(250)
      : null,
    [relatedAPID]
  );

  const timeConfig = getIncidentTimeConfig(incident);

  // Use our context to get topology data instead of the hook
  const { nodes, relationships, loading, error } = useRootCauseTopologyDataContext();

  if (loading) {
    return <LoadingSpinner description="Loading topology" withOverlay={false} />;
  }

  if (error) {
    return (
      <ErrorEmptyState
        className={locals.emptyStateContainer}
        title={t('in-events:RCA.topology.failedToLoadTitle')}
        subtitle={t('in-events:RCA.topology.failedToLoadDescription')}
      />
    );
  }

  return (
    <RCATopologyTimeWindowContext.Provider value={timeConfig}>
      <RCATopologyAPContext.Provider value={relatedAPInfo ? [relatedAPInfo] : []}>
        <ProductiveCard
          title="Topology"
          className={locals.cardWithBorder}
          actionIcons={[
            {
              icon: DataClass
            },
            {
              icon: ZoomIn
            },
            {
              icon: ZoomOut
            }
          ]}
        >
          <RootCauseTopology
            relationships={relationships}
            nodes={nodes}
            height={'40vh'}
            width={'100%'}
            showSidePanel={false}
          />
        </ProductiveCard>
      </RCATopologyAPContext.Provider>
    </RCATopologyTimeWindowContext.Provider>
  );
};

export default memo(Topology, (prev, next) => prev.incident.id === next.incident.id);
