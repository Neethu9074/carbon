import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import ServerCallTree from 'in-analyze/TraceDetail/components/CallTree/ServerCallTree';
import { setConditions } from 'in-subscription/resultSubscriptions';
import { createColorPool } from 'in-services/util/ColorGenerator';
import { always } from 'in-services/fixedStreams';

import TraceExamples from './TraceExamplesComponent';
import Conditional from '../_helpers/Conditional';
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
        <Conditional
          setConditions={() => {
            setConditions([
              {
                eventId: 'getSpanTree',
                getDummyData: () => rootSpan
              }
            ]);
          }}
        >
          <Root>
            <ServerCallTree getColor={getColorByServiceAndEndpoint} />
          </Root>
        </Conditional>
      )}
    />
  );
}

function LoadingStory() {
  return (
    <Conditional
      setConditions={() => {
        setConditions([
          {
            eventId: 'getSpanTree',
            requestDummyLoadingData: true
          }
        ]);
      }}
    >
      <Root>
        <ServerCallTree />
      </Root>
    </Conditional>
  );
}

function ErrorStory() {
  return (
    <Conditional
      setConditions={() => {
        setConditions([
          {
            eventId: 'getSpanTree',
            requestDummyErrorData: true
          }
        ]);
      }}
    >
      <Root>
        <ServerCallTree />
      </Root>
    </Conditional>
  );
}
