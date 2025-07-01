/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 *
 */

import React from 'react';

import EvidenceSection from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/EvidenceSection';
import MetricsSection from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/MetricsSection';
import EntityPath from 'in-events/components/RootCauseAnalysis/AgenticInvestigation/RootCauseSidebar/EntityPath';

import locals from './RootCauseEntityDetails.mless';

const RootCauseEntityDetails: React.FC = () => {
  return (
    <div className={locals.rcDetailsContainer}>
      <EntityPath />
      <EvidenceSection />
      <MetricsSection />
    </div>
  );
};

export default RootCauseEntityDetails;
