import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { createColorPool } from 'in-services/util/ColorGenerator';
import CallTree from 'in-analyze/TraceDetail/components/CallTree';

import TraceExamples from './TraceExamplesComponent';
import Root from '../_helpers/Root';

const byServiceEndpointCombinationColorPool = createColorPool('serviceAndEndpointCombination');
const getColorByServiceAndEndpoint = ({ service, endpoint }) =>
  byServiceEndpointCombinationColorPool.getColorHex(`${service.id}__${endpoint.id}`);

storiesOf('analyse/CallTree', module)
  .addDecorator(withKnobs)
  .add('Call Tree', () => <CallTreeStory />)
  .add('Loading', () => <LoadingStory />)
  .add('Error', () => <ErrorStory />);

function CallTreeStory() {
  return (
    <TraceExamples
      render={rootSpan => (
        <Root>
          <CallTree
            spanTreeResult={{ data: rootSpan, errors: [], progress: {} }}
            getColor={getColorByServiceAndEndpoint}
          />
        </Root>
      )}
    />
  );
}

function LoadingStory() {
  return (
    <Root>
      <CallTree spanTreeResult={{ progress: { loading: true } }} />
    </Root>
  );
}

function ErrorStory() {
  return (
    <Root>
      <CallTree
        spanTreeResult={{ errors: [{ message: 'something went wrong' }, { message: 'also this should not happen' }] }}
      />
    </Root>
  );
}
