/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import OpenIssuesListPresenter from 'in-components/health/OpenIssuesListPresenter';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import getEntityHealthInfo from 'in-kubernetes/subscriptions/getEntityHealthInfo';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId, timeConfig }) => {
    return {
      openIssuesResult: getEntityHealthInfo({
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
        eventTypeFilter: 'issue'
      });

    return (
      <OpenIssuesListPresenter
        close={close}
        openIssuesResult={openIssuesResult}
        analyzeLink={getEventsViewFilteredBy({
          snapshotId,
          eventTypeFilter: 'issue'
        })}
        getIssueLink={getIssueLink}
      />
    );
  }
);
