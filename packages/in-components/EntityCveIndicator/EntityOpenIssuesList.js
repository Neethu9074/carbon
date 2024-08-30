/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import OpenIssuesListPresenter from 'in-components/health/OpenIssuesListPresenter';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import getCveInfo from 'in-kubernetes/subscriptions/getCveInfo';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId, timeConfig }) => {
    return {
      openIssuesResult: getCveInfo({
        snapshotId,
        timeConfig
      })
        .startWith(indeterminateProgress)
        .map(result => mapData(result, data => data.openIssues))
    };
  },
  function EntityOpenIssuesList({ openIssuesResult, snapshotId, close }) {
    const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
    const getIssueLink = eventId =>
      getEventsViewFilteredBy({
        snapshotId,
        eventId,
        eventTypeFilter: 'cve_issue'
      });

    return (
      <OpenIssuesListPresenter
        close={close}
        openIssuesResult={openIssuesResult}
        analyzeLink={getEventsViewFilteredBy({
          snapshotId,
          eventTypeFilter: 'cve_issue'
        })}
        getIssueLink={getIssueLink}
      />
    );
  }
);
