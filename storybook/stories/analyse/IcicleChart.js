import { storiesOf } from '@storybook/react';
import React from 'react';

import { getColor } from 'in-applications/endpointTypes';
import IcicleChart from 'in-new-components/IcicleChart';

import TraceExamples from './TraceExamplesComponent';
import Root from '../_helpers/Root';

const getColorByEndpointType = ({ endpoint }) => getColor(endpoint.type);

storiesOf('analyse/IcicleChart', module).add('Icicle Chart', () => <IcicleChartStory />);

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
