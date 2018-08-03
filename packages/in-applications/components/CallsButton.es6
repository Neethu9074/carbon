import { get } from 'lodash';
import React from 'react';

import CallsButtonDialog from 'in-applications/components/CallsButtonDialog/CallsButtonDialog';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import getMetrics from 'in-subscription/application/getMetrics';
import Overlay from 'in-new-components/overlays/Overlay';
import { number } from 'in-services/formatters/number';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';

export default connect(
  ({ timeConfig, applicationId, serviceId, endpointId }) => {
    const callCountResult = getMetrics({
      filter: {
        timeConfig,
        application: applicationId,
        service: serviceId,
        endpoint: endpointId
      },
      metrics: {
        callCount: {
          metric: 'calls',
          aggregation: 'SUM'
        }
      }
    });
    return {
      callCountResult,
      callCount: callCountResult.map(result => {
        if (!result || !result.data) {
          return null;
        }
        return get(result, ['data', 'callCount', '0', '1'], null);
      })
    };
  },
  function CallsButton(props) {
    const { callCount, callCountResult, timeConfig } = props;
    if (!callCount) {
      return null;
    }

    return (
      <Overlay
        props={{ ...props, callCount, timeConfig: getTimeConfigAlignedToResultTime(timeConfig, callCountResult) }}
        content={CallsButtonDialog}
        withoutWrapper
      >
        {CallButton}
      </Overlay>
    );
  }
);

function CallButton({ size, kind = 'primary', callCount, toggle, refSetter }) {
  return (
    <Button kind={kind} size={size} icon="lib_application_trace" onClick={toggle} refSetter={refSetter}>
      {number.compact(callCount)} Calls
    </Button>
  );
}
