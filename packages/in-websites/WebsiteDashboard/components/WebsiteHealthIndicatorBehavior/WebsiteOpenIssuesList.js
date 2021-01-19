/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import OpenIssuesListPresenter from 'in-new-components/health/OpenIssuesListPresenter';
import getWebsiteHealthInfo from 'in-subscription/website/getWebsiteHealthInfo';
import { getEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ websiteId, timeConfig }) => {
    return {
      openIssuesResult: getWebsiteHealthInfo({
        websiteId,
        timeConfig
      })
        .startWith(indeterminateProgress)
        .map(result => mapData(result, data => data.openIssues))
    };
  },
  function WebsiteOpenIssuesList({ openIssuesResult, eventId, close }) {
    return (
      <OpenIssuesListPresenter
        close={close}
        openIssuesResult={openIssuesResult}
        analyzeLink$={getEventsViewFilteredBy({
          eventId,
          eventTypeFilter: 'issue'
        })}
        getIssueLink={eventId =>
          getEventsViewFilteredBy({
            eventId,
            eventTypeFilter: 'issue'
          })
        }
      />
    );
  }
);
