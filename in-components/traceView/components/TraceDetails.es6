import irpt from 'react-immutable-proptypes';
import React from 'react';

import TraceWaterfallChart from 'in-components/traceView/components/TraceWaterfallChart';
import TraceHeading from 'in-components/traceView/components/TraceHeading';
import TabHeader from 'in-components/traceView/components/TabHeader';
import {msZeroDecimalPlaces} from 'in-services/formatters/number';
import {selectedTrace, selectedTraceId} from 'in-stores/traces';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {formatDateTime} from 'in-services/formatters/date';
import PropList from 'in-components/PropList';
import connectTo from 'in-hoc/connectTo';
import {getLabel} from 'in-sdk/tracing';

import './TraceDetails.less';


const block = 'in-trace-details';

export default connectTo({
  traceId: selectedTraceId,
  trace: selectedTrace
}, TraceDetails);

function TraceDetails({traceId, trace}) {
  if (!traceId) {
    return <p>No trace selected.</p>;
  }

  if (!trace) {
    return <LoadingIndicator type='dark' />;
  } else if (trace.get('traceId') !== traceId) {
    return <LoadingIndicator type='dark' />;
  }

  return (
    <div className={block}>
      <TabHeader left={<TraceHeading>{getLabel(trace)}</TraceHeading>} />

      <PropList className={block + '__props'}>
        <PropList.Prop label='Start'
                       value={formatDateTime(trace.get('start'))} />

        <PropList.Prop label='Duration'
                       value={msZeroDecimalPlaces(trace.get('duration'))} />

        <PropList.Prop label='Depth'
                       value={getDepth(trace)} />

        <PropList.Prop label='Calls'
                       value={getCalls(trace)} />
      </PropList>

      <TraceWaterfallChart trace={trace} />
    </div>
  );
}

TraceDetails.propTypes = {
  traceId: React.PropTypes.string,
  trace: irpt.map
};

function getDepth(span) {
  let maxDepth = 1;

  span.get('childSpans').forEach(childSpan => {
    maxDepth = Math.max(maxDepth, getDepth(childSpan) + 1);
  });

  return maxDepth;
}

function getCalls(span) {
  let calls = 1;

  span.get('childSpans').forEach(childSpan => {
    calls += getCalls(childSpan);
  });

  return calls;
}
