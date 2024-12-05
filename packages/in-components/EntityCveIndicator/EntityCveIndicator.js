/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityOpenIssuesList from 'in-components/EntityCveIndicator/EntityOpenIssuesList';
import { useVulnerabilityTracker } from 'in-events/useVulnerabilityTracker';
import Overlay from 'in-components/overlays/Overlay';

import locals from './EntityCveIndicator.mless';

export default function EntityCveIndicator(props) {
  const { trackVulnerabilitiesButtonInContainersDashboard } = useVulnerabilityTracker();
  const { openIssues, maxSeverity } = props;

  if (openIssues == null || openIssues < 0) {
    return null;
  }

  if (openIssues === 0) {
    return <props.IndicatorPresenter showCheckAsNeutral maxSeverity={maxSeverity} openIssues={openIssues} />;
  }

  return (
    <Overlay props={props} content={Content} withoutWrapper inContentArea={props.inContentArea}>
      {({ toggle, refSetter }) => (
        <props.IndicatorPresenter
          openIssues={openIssues}
          maxSeverity={maxSeverity}
          onClick={() => {
            toggle();
            trackVulnerabilitiesButtonInContainersDashboard();
          }}
          refSetter={refSetter}
        />
      )}
    </Overlay>
  );
}

function Content(props) {
  return (
    <div className={locals.entityCveIndicator}>
      <EntityOpenIssuesList {...props} />
    </div>
  );
}
