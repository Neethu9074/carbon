import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import ServerCallTree from 'in-analyze/TraceDetail/components/CallTree/ServerCallTree';
import { createColorPool } from 'in-services/util/ColorGenerator';
import CallTree from 'in-analyze/TraceDetail/components/CallTree';
import { always } from 'in-services/fixedStreams';

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
          <CallTree rootSpan={rootSpan} getColor={getColorByServiceAndEndpoint} />
        </Root>
      )}
    />
  );
}

function LoadingStory() {
  return (
    <Root>
      <ServerCallTree get={() => always({ progress: { loading: true } })} />
    </Root>
  );
}

function ErrorStory() {
  return (
    <Root>
      <ServerCallTree
        get={() =>
          always({ errors: [{ message: 'something went wrong' }, { message: 'also this should not happen' }] })
        }
      />
    </Root>
  );
}
