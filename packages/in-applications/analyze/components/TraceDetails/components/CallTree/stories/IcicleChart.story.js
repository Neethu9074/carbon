/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TraceExamples from 'in-applications/analyze/components/TraceDetails/components/CallTree/stories/TraceExamplesComponent';
import ServerIcicleChart from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/ServerIcicleChart';
import IcicleChart from 'in-applications/analyze/components/TraceDetails/components/IcicleChart';
import { getColor } from 'in-applications/endpointTypes';
import { always } from 'in-services/fixedStreams';
import theme from 'in-themes';

const getColorByEndpointType = ({ endpoint }) =>
  !endpoint || !endpoint.type ? theme.lib.colors.N500 : getColor(endpoint.type);

export default {
  component: IcicleChart
};

export function Default() {
  return (
    <TraceExamples
      render={rootCall => (
        <IcicleChart
          rootCall={rootCall}
          getColor={getColorByEndpointType}
          openedCall$={always({
            progress: { loading: false },
            errors: [],
            data: {}
          })}
        />
      )}
    />
  );
}

export function LoadingStory() {
  return (
    <ServerIcicleChart
      callTreeResult={{
        progress: { loading: true },
        errors: [],
        data: {}
      }}
    />
  );
}

export function ErrorStory() {
  return (
    <ServerIcicleChart
      callTreeResult={{
        progress: { loading: false },
        errors: [{ message: 'Unexpected server error' }],
        data: {}
      }}
    />
  );
}
