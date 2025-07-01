/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import TraceExamples from 'in-applications/analyze/components/TraceDetails/components/CallTree/stories/TraceExamplesComponent';
import ServerIcicleChart from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/ServerIcicleChart';
import IcicleChart from 'in-applications/analyze/components/TraceDetails/components/IcicleChart';
import {getColorChart} from 'in-applications/endpointTypes';
import { always } from 'in-services/fixedStreams';

export default {
  component: IcicleChart
};

export function Default() {
  const getColorByEndpointType = ({ endpoint }) =>
    !endpoint || !endpoint.type ? themes.default.ids.color.option.neutral['500'] : getColorChart(endpoint.type);

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
