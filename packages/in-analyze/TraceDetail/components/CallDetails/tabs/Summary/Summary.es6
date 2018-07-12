import React, { Fragment } from 'react';

import EntryExitInformation from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/EntryExitInformation';
import TimingInformation from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/TimingInformation';
import CallTimingSummary from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/CallTimingSummary';
import TimingChart from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/TimingChart';
import CallStatus from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/CallStatus';
import Seperator from 'in-analyze/TraceDetail/components/CallDetails/components/Seperator';
import { hasOnlyExitSpan } from 'in-analyze/TraceDetail/shared/CallHelper';

export default function Summary({ call, callTreeNode, getColor }) {
  const onlyHasExitSpan = hasOnlyExitSpan(call);
  return (
    <Fragment>
      <CallStatus call={call} />
      {!onlyHasExitSpan && (
        <Fragment>
          <CallTimingSummary call={call} />
          <TimingChart call={call} callTreeNode={callTreeNode} getColor={getColor} />
          <TimingInformation call={call} />
        </Fragment>
      )}
      <Seperator />
      <EntryExitInformation call={call} />
    </Fragment>
  );
}
