import React from 'react';

import HistogramCardPresenter from 'in-new-components/Histogram/HistogramCardPresenter';
import { deepCopy } from 'in-services/util/object';
import connectTo from 'in-hoc/connectTo';

/*

Sample Usage:

<HistogramCardWrapper
  cardTitle={cardTitle}
  metricId="calls"
  subscription={
    getLatencyDistribution({
      maxLatencyBuckets: 10,
      filter: {
        timeframe,
        application: applicationId,
        service: serviceId,
        endpoint: endpointId
      }
    })
  }
/>
 */
export default connectTo(
  props => ({
    result: props.subscription
  }),
  function HistogramCardWrapper({ result, ...props }) {
    return <HistogramCardPresenter result={result} config={wrapProps(result, props)} />;
  }
);

function wrapProps(result, props) {
  if (result.errors.length > 0 || result.progress.loading) {
    return {
      cardTitle: props.cardTitle
    };
  }

  props.from = props.from || 'from';
  props.to = props.to || 'to';

  const propsClone = deepCopy(props);

  propsClone.buckets = result.data.map(bucket => ({
    from: bucket[props.from],
    to: bucket[props.to],
    value: bucket[props.metricId]
  }));

  return propsClone;
}
