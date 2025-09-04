/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GenericIndicatorPresenter from 'in-components/GenericIndicatorPresenter/GenericIndicatorPresenter';
import EntityOpenIssuesList from 'in-components/EntityCveIndicator/EntityOpenIssuesList';
import { useVulnerabilityTracker } from 'in-events/useVulnerabilityTracker';

import locals from './EntityCveIndicator.mless';

// Wrapper component for EntityOpenIssuesList to apply styling
const StyledEntityOpenIssuesList = props => (
  <div className={locals.entityCveIndicator}>
    <EntityOpenIssuesList {...props} />
  </div>
);

export default function EntityCveIndicator(props) {
  const { trackVulnerabilitiesButtonInContainersDashboard } = useVulnerabilityTracker();
  const { openIssues, maxSeverity, inContentArea, IndicatorPresenter } = props;

  if (openIssues == null || openIssues < 0) {
    return null;
  }

  if (openIssues === 0) {
    return <props.IndicatorPresenter showCheckAsNeutral maxSeverity={maxSeverity} openIssues={openIssues} />;
  }

  return (
    <GenericIndicatorPresenter
      Content={StyledEntityOpenIssuesList}
      contentProps={props}
      IndicatorPresenter={IndicatorPresenter}
      indicatorProps={{
        openIssues,
        maxSeverity,
        onClick: trackVulnerabilitiesButtonInContainersDashboard
      }}
      inContentArea={inContentArea}
    />
  );
}
