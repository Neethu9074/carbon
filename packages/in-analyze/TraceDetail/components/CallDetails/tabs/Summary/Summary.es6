import React, { Fragment } from 'react';

import EntryExitInformation from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/EntryExitInformation';
import TimingInformation from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/TimingInformation';
import TimingChart from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/TimingChart';
import CallStatus from 'in-analyze/TraceDetail/components/CallDetails/tabs/Summary/CallStatus';
import Seperator from 'in-analyze/TraceDetail/components/CallDetails/components/Seperator';

export default function Summary({ call, traceId }) {
  return (
    <Fragment>
      <CallStatus call={call} />
      <TimingInformation call={call} />
      <TimingChart call={call} traceId={traceId} />
      <Seperator />
      <EntryExitInformation call={call} />
    </Fragment>
  );
}
