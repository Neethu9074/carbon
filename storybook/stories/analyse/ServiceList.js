import { storiesOf } from '@storybook/react';
import React from 'react';

import ServiceEndpointList from 'in-analyze/TraceDetail/components/ServiceEndpointList';
import { setConditions } from 'in-subscription/resultSubscriptions';
import { createColorPool } from 'in-services/util/ColorGenerator';

import Conditional from '../_helpers/Conditional';
import Root from '../_helpers/Root';

const byServiceEndpointCombinationColorPool = createColorPool('serviceAndEndpointCombination');
const getColorByServiceAndEndpoint = ({ service, endpoint }) =>
  byServiceEndpointCombinationColorPool.getColorHex(`${service.id}__${endpoint.id}`);

storiesOf('analyse/ServiceList', module)
  .add('Service List', () => <ServiceListStory />)
  .add('Loading', () => <LoadingStory />)
  .add('Error', () => <ErrorStory />);

function ServiceListStory() {
  return (
    <Conditional
      setConditions={() => {
        setConditions([
          {
            eventId: 'getTraceParticipants',
            getDummyData: () => ({
              items: [
                {
                  service: {
                    id: '1',
                    label: 'service 1',
                    types: ['HTTP']
                  },
                  endpoint: {
                    id: '2',
                    label: 'endpoint 1',
                    type: 'HTTP'
                  },
                  aggregatedTime: 230,
                  errorCount: 0
                },
                {
                  service: {
                    id: '3',
                    label: 'service 2',
                    types: ['HTTP']
                  },
                  endpoint: {
                    id: '4',
                    label: 'endpoint 2',
                    type: 'HTTP'
                  },
                  aggregatedTime: 420,
                  errorCount: 1
                }
              ],
              page: 1,
              pageSize: 2,
              totalHits: 2
            })
          }
        ]);
      }}
    >
      <Root>
        <ServiceEndpointList traceId="dummyTraceId" getColor={getColorByServiceAndEndpoint} />
      </Root>
    </Conditional>
  );
}

function LoadingStory() {
  return (
    <Conditional
      setConditions={() => {
        setConditions([
          {
            eventId: 'getTraceParticipants',
            requestDummyLoadingData: true
          }
        ]);
      }}
    >
      <Root>
        <ServiceEndpointList traceId="dummyLoadingTraceId" getColor={getColorByServiceAndEndpoint} />
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
            eventId: 'getTraceParticipants',
            requestDummyErrorData: true
          }
        ]);
      }}
    >
      <Root>
        <ServiceEndpointList traceId="dummyErrorTraceId" getColor={getColorByServiceAndEndpoint} />
      </Root>
    </Conditional>
  );
}
