/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

// eslint-disable-next-line no-restricted-imports
import { Stack } from '@carbon/react';
import React from 'react';

import ActionsSection from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/ActionsSection/ActionsSection';
import EvidenceSection from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/EvidenceSection';
import MetricsSection from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/MetricsSection';
import EntityPath from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/EntityPath';

import locals from './RootCauseEntityDetails.mless';

const RootCauseEntityDetails: React.FC = () => {
  return (
    <div className={locals.rcDetailsContainer}>
      <Stack orientation="vertical" gap={5}>
        <EntityPath />
        <EvidenceSection />
        <MetricsSection />
      </Stack>
      <Stack>
        <ActionsSection />
      </Stack>
    </div>
  );
};

export default RootCauseEntityDetails;
