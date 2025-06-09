/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { createContext, useContext, useState } from 'react';

import { CarbonTab, CarbonTabList, CarbonTabs, LoadingSpinner } from '@instana/components';
import { ErrorEmptyState } from '@instana/ibm-products';

import { useRootCauseTopologyDataContext } from 'in-events/components/RootCauseAnalysis/Topology/context/RootCauseTopologyDataContext';
import getRootCauseTabSecondaryLabel from 'in-events/components/RootCauseAnalysis/utils/getRootCauseTabSecondaryLabel';
import SelectedRootCauseContext from 'in-events/components/RootCauseAnalysis/hooks/SelectedRootCauseContext';
import getRootCauseTabLabel from 'in-events/components/RootCauseAnalysis/utils/getRootCauseTabLabel';
import RootCauseTopology from 'in-events/components/RootCauseAnalysis/Topology/RootCauseTopology';
import RootCauseLegend from 'in-events/components/RootCauseAnalysis/Topology/RootCauseLegend';
import { RootCause } from 'in-events/components/RootCauseAnalysis/utils/types';
import { Application, Event, Nullish, TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-events/components/RootCauseAnalysis/Topology/RootCauseMap.mless';

interface NewRootCauseTopologyDialogProps {
  relatedApplicationInformation: Application | Nullish;
  incident: Event;
  timeConfig: TimeConfig;
  rootCauses: RootCause[];
}

// Define the shape of the SelectedRootCauseContext
interface SelectedRootCauseContextType {
  selectedRootCause: number;
  setSelectedRootCause: React.Dispatch<React.SetStateAction<number>>;
}

export const RCATopologyTimeWindowContext = createContext<TimeConfig | null>(null);
export const RCATopologyAPContext = createContext<Application[]>([]);

export default function RootCauseTopologyDialog({
  relatedApplicationInformation,
  rootCauses,
  timeConfig
}: NewRootCauseTopologyDialogProps) {
  const selectedRootCauseContext = useContext(SelectedRootCauseContext) as SelectedRootCauseContextType | null;
  const { selectedRootCause = 0, setSelectedRootCause = () => {} } = selectedRootCauseContext || {};
  const [showOverview, setShowOverview] = useState(false);

  // Use our context to get topology data
  const { nodes, relationships, loading, error } = useRootCauseTopologyDataContext();

  if (error) {
    return (
      <ErrorEmptyState
        className={locals.emptyStateContainer}
        title={t('in-events:RCA.topology.failedToLoadTitle')}
        subtitle={t('in-events:RCA.topology.failedToLoadDescription')}
      />
    );
  }

  if (loading) {
    return <LoadingSpinner description="Loading topology" withOverlay={false} />;
  }

  return (
    <RCATopologyTimeWindowContext.Provider value={timeConfig}>
      <RCATopologyAPContext.Provider value={relatedApplicationInformation ? [relatedApplicationInformation] : []}>
        <CarbonTabs
          selectedIndex={showOverview ? 0 : selectedRootCause + 1}
          onChange={i => {
            if (i.selectedIndex === 0) {
              setShowOverview(true);
            } else {
              setSelectedRootCause(i.selectedIndex - 1);
              setShowOverview(false);
            }
          }}
        >
          <CarbonTabList aria-label="topology views" contained>
            <CarbonTab key={0}>{t('in-events:RCA.topology.overviewTab')}</CarbonTab>
            {rootCauses.map((rootCause, idx) => (
              <CarbonTab key={rootCause.snapshotId} secondaryLabel={getRootCauseTabSecondaryLabel(rootCause)}>
                {getRootCauseTabLabel(idx)}
              </CarbonTab>
            ))}
          </CarbonTabList>
        </CarbonTabs>
        <RootCauseTopology relationships={relationships} nodes={nodes} height={'80vh'} width={'100%'} />
        <RootCauseLegend />
      </RCATopologyAPContext.Provider>
    </RCATopologyTimeWindowContext.Provider>
  );
}
