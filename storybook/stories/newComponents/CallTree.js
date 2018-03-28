import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import ServerCallTree from 'in-new-components/CallTree/ServerCallTree';
import { createColorPool } from 'in-services/util/ColorGenerator';
import { always } from 'in-services/fixedStreams';
import CallTree from 'in-new-components/CallTree';

import getTraceFromExamples from '../_helpers/getTraceFromExample';
import Root from '../_helpers/Root';

const byServiceEndpointCombinationColorPool = createColorPool('serviceAndEndpointCombination');
const getColorByServiceAndEndpoint = ({ service, endpoint }) =>
  byServiceEndpointCombinationColorPool.getColorHex(`${service.id}__${endpoint.id}`);

storiesOf('newComponents/CallTree', module)
  .addDecorator(withKnobs)
  .add('CallTree', () => <CallTreeStory />)
  .add('Loading', () => <LoadingStory />)
  .add('Error', () => <ErrorStory />);

function CallTreeStory() {
  const rootSpan = getTraceFromExamples();
  if (!rootSpan) {
    return null;
  }

  return (
    <Root>
      <CallTree rootSpan={rootSpan} getColor={getColorByServiceAndEndpoint} />
    </Root>
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
