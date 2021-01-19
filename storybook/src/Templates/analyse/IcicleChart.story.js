/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import React from 'react';

import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import IcicleChart from 'in-analyze/TraceDetail/components/IcicleChart';
import { getColor } from 'in-applications/endpointTypes';
import TraceExamples from './TraceExamplesComponent';
import { always } from 'in-services/fixedStreams';

const getColorByEndpointType = ({ endpoint }) =>
  !endpoint || !endpoint.type ? theme.lib.colors.N500 : getColor(endpoint.type);

export default {
  title: 'Templates|analyze/IcicleChart',
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
      mockedStream={() =>
        always({
          progress: { loading: true },
          errors: [],
          data: {}
        })
      }
    />
  );
}

export function ErrorStory() {
  return (
    <ServerIcicleChart
      mockedStream={() =>
        always({
          progress: { loading: false },
          errors: [{ message: 'Unexpected server error' }],
          data: {}
        })
      }
    />
  );
}
