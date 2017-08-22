import React from 'react';

import ErrorBreakdownTable from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Errors/ErrorBreakdownTable';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import { getErrorBreakdownForWebsite } from 'in-services/api/eumErrors';
import memoize from 'in-services/util/memoizingObservableGenerator';
import Notification from 'in-sdk/components/dashboard/Notification';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { combineDataAndError } from 'in-services/util/ro';
import Code from 'in-sdk/components/traceDetails/Code';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

// ensure that react repaints do not result in frequent backend calls
const getBreakdown = memoize(
  ({ snapshot, timeframe, match, pageHash }) =>
    combineDataAndError(
      getErrorBreakdownForWebsite({
        websiteSnapshotId: snapshot.get('id'),
        timeframe: timeframe,
        errorHash: match.params.errorHash,
        pageHash: pageHash
      })
    ).delayedStop(35000),
  ({ snapshot, timeframe, match, pageHash }) =>
    snapshot.get('id') + timeframe.to + timeframe.windowSize + match.params.errorHash + pageHash,
  30000
);

export default connectTo(
  props => {
    return {
      result: getBreakdown(props)
    };
  },
  function ErrorDetails({ match, snapshot, result, pageHash, pageName }) {
    if (result == null) {
      return <LoadingIndicator type="dark" />;
    } else if (result.error) {
      return (
        <Notification type="warning">
          <strong>Failed to retrieve error details.</strong> Please refresh the page or contact customer{' '}
          support should this issue persist.
        </Notification>
      );
    }

    const errorHash = match.params.errorHash;
    const message = result.data.get('message', '');
    const stack = result.data.get('stack');

    const isErrorNotReadableDueToSameOriginPolicy = /^Script Error\.?/i.test(message);
    const backButtonPath = pageHash ? `/pages/${encodeURIComponent(pageHash)}/errors` : `/errors`;

    return (
      <div>
        <BackButton label="Back to error list" href$={getSubDashboardLink(backButtonPath)} />

        <DashboardTile title="Details">
          <DescriptionList>
            <DescriptionItem title="Message">
              {message}
            </DescriptionItem>

            {stack && !isErrorNotReadableDueToSameOriginPolicy
              ? <DescriptionItem title="Stack">
                  <Code code={stack} />
                </DescriptionItem>
              : null}

            {isErrorNotReadableDueToSameOriginPolicy
              ? <Notification type="info">
                  <strong>Error details not accessible.</strong>{' '}
                  Due to same-origin policy restrictions, the browser did not permit access to the error message and{
                    ' '
                  }
                  stack trace of this uncaught error. To gain visibility into these error details, please add the{' '}
                  <code>crossorigin=&quot;anonymous&quot;</code> attribute to HTML script tags and serve JavaScript
                  files{' '}
                  with an <code>Access-Control-Allow-Origin: *</code> HTTP header.
                </Notification>
              : null}
          </DescriptionList>
        </DashboardTile>

        {instanaInternalFeaturesEnabled
          ? <DashboardTile title="Occurences over time">
              <strong style={{ color: 'darkred' }}>
                Show a chart how often this error occurred over time. This is currently not possible and will
                require backend work.
              </strong>
            </DashboardTile>
          : null}

        <ErrorBreakdownTable
          result={result}
          errorHash={errorHash}
          websiteLabel={getLabel(snapshot)}
          errorMessage={message}
          pageName={pageName}
          pageHash={pageHash}
        />
      </div>
    );
  }
);
