import { storiesOf } from '@storybook/react';
import React from 'react';

import { getColor } from 'in-applications/endpointTypes';
import IcicleChart from 'in-new-components/IcicleChart';
import ServerIcicleChart from 'in-new-components/IcicleChart/ServerIcicleChart';
import { always } from 'in-services/fixedStreams';

import TraceExamples from './TraceExamplesComponent';
import Root from '../_helpers/Root';

const getColorByEndpointType = ({ endpoint }) => getColor(endpoint.type);

storiesOf('analyse/IcicleChart', module)
  .add('Icicle Chart', () => <IcicleChartStory />)
  .add('Loading', () => <LoadingStory />)
  .add('Error', () => <ErrorStory />);

function IcicleChartStory() {
  return (
    <TraceExamples
      render={rootSpan => (
        <Root>
          <IcicleChart rootSpan={rootSpan} getColor={getColorByEndpointType} />
        </Root>
      )}
    />
  );
}

function LoadingStory() {
  return (
    <Root>
      <ServerIcicleChart get={() => always({ progress: { loading: true } })} />
    </Root>
  );
}

function ErrorStory() {
  return (
    <Root>
      <ServerIcicleChart
        get={() =>
          always({ errors: [{ message: 'Unexpected server error' }] })
        }
      />
    </Root>
  );
}
