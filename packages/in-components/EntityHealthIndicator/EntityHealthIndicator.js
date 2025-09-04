/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GenericIndicatorPresenter from 'in-components/GenericIndicatorPresenter/GenericIndicatorPresenter';
import EntityOpenIssuesList from 'in-components/EntityHealthIndicator/EntityOpenIssuesList';

// Wrapper component for EntityOpenIssuesList to apply styling
const StyledEntityOpenIssuesList = props => <EntityOpenIssuesList {...props} />;

export default function EntityHealthIndicator(props) {
  const { openIssues, maxSeverity, inContentArea, IndicatorPresenter } = props;

  if (openIssues == null || openIssues < 0) {
    return null;
  }

  if (openIssues === 0) {
    return <IndicatorPresenter showCheckAsNeutral maxSeverity={maxSeverity} openIssues={openIssues} />;
  }

  return (
    <GenericIndicatorPresenter
      Content={StyledEntityOpenIssuesList}
      contentProps={{ ...props }}
      IndicatorPresenter={IndicatorPresenter}
      indicatorProps={{
        openIssues,
        maxSeverity
      }}
      inContentArea={inContentArea}
    />
  );
}
