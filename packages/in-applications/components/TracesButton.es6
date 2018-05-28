import { get } from 'lodash';
import React from 'react';

import TraceList from 'in-applications/components/TraceButtonDialogPresenter/TraceList';
import getMetrics from 'in-subscription/application/getMetrics';
import Overlay from 'in-new-components/overlays/Overlay';
import { number } from 'in-services/formatters/number';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

export default connect(
  props => ({
    traceCount: getTracesCount(props)
  }),
  function TracesButton(props) {
    const { traceCount } = props;
    if (!traceCount) {
      return null;
    }

    return (
      <Overlay props={{ ...props, traceCount }} content={TraceList} position="fixed">
        {TraceButton}
      </Overlay>
    );
  }
);

function TraceButton({ size, kind = 'primary', traceCount, open, toggle }) {
  return (
    <div onMouseEnter={open}>
      <Button kind={kind} size={size} icon="lib_application_trace" onClick={toggle}>
        {number.compact(traceCount)} Traces
      </Button>
    </div>
  );
}

export function getTracesCount({ timeConfig, applicationId, serviceId, endpointId }) {
  return getMetrics({
    filter: {
      timeConfig,
      application: applicationId,
      service: serviceId,
      endpoint: endpointId
    },
    metrics: {
      traceCount: {
        metric: 'traces',
        aggregation: 'DISTINCT_COUNT'
      }
    }
  }).map(result => {
    if (!result || !result.data) {
      return null;
    }
    return get(result, ['data', 'traceCount', '0', '1'], null);
  });
}
