import { storiesOf } from '@storybook/react';
import React from 'react';

import ServerIcicleChart from 'in-analyze/TraceDetail/components/IcicleChart/ServerIcicleChart';
import IcicleChart from 'in-analyze/TraceDetail/components/IcicleChart';
import { getColor } from 'in-applications/endpointTypes';
import { always } from 'in-services/fixedStreams';

import TraceExamples from './TraceExamplesComponent';
import Root from '../_helpers/Root';
import theme from 'in-themes';

const getColorByEndpointType = ({ endpoint }) =>
  (!endpoint || !endpoint.type) ? theme.lib.colors.N500 : getColor(endpoint.type);

storiesOf('analyse/IcicleChart', module)
  .add('Icicle Chart', () => <IcicleChartStory />)
  .add('Loading', () => <LoadingStory />)
  .add('Error', () => <ErrorStory />);

function IcicleChartStory() {
  return (
    <TraceExamples
      render={rootCall => (
        <Root>
          <IcicleChart rootCall={rootCall} getColor={getColorByEndpointType} />
        </Root>
      )}
    />
  );
}

function LoadingStory() {
  return (
    <Root>
      <ServerIcicleChart
        mockedStream={() =>
          always({
            progress: { loading: true },
            errors: [],
            data: {}
          })
        }
      />
    </Root>
  );
}

function ErrorStory() {
  return (
    <Root>
      <ServerIcicleChart
        mockedStream={() =>
          always({
            progress: { loading: false },
            errors: [{ message: 'Unexpected server error' }],
            data: {}
          })
        }
      />
    </Root>
  );
}
