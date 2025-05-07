/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import OpenIssuesListPresenter from 'in-components/health/OpenIssuesListPresenter';
import getMobileHealthInfo from 'in-mobile-apps/subscriptions/getMobileHealthInfo';
import { useGetEventsViewFilteredBy } from 'in-stores/navigation/paths/eventPaths';
import { indeterminateProgress } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ mobileAppId, timeConfig }) => {
    return {
      openIssuesResult: getMobileHealthInfo({
        mobileAppId,
        timeConfig
      })
        .startWith(indeterminateProgress)
        .map(result => mapData(result, data => data.openIssues))
    };
  },
  function MobileOpenIssuesList({ inContentArea, openIssuesResult, eventId, close, mobileAppId }) {
    // A simple solution to avoid some parts of the popup area hidden when too wide.
    // This workaround tackles it, until
    // a fix will have been implemented which solves the layout problem on other areas, too
    // Planned to be tackled in a bigger scope as part of this task:
    // https://instana.kanbanize.com/ctrl_board/37/cards/73986/details/
    function WithMaxWidthWhenInContentArea({ children, maxWidth = '80vw' }) {
      if (inContentArea) return <div style={{ maxWidth }}>{children}</div>;
      return <>{children}</>;
    }
    const { getEventsViewFilteredBy } = useGetEventsViewFilteredBy();
    const useIssueLink = eventId =>
      getEventsViewFilteredBy({
        eventId,
        eventTypeFilter: 'issue'
      });

    return (
      <WithMaxWidthWhenInContentArea>
        <OpenIssuesListPresenter
          close={close}
          openIssuesResult={openIssuesResult}
          analyzeLink={getEventsViewFilteredBy({
            eventId,
            eventTypeFilter: 'issue',
            applicationId: mobileAppId,
            additionalDFQFilter: `event.state:"open"`
          })}
          getIssueLink={useIssueLink}
        />
      </WithMaxWidthWhenInContentArea>
    );
  }
);
