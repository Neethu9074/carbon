/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withKnobs } from '@storybook/addon-knobs/react';
import { create } from '@instana/observables';
import React from 'react';

import CallTree from 'in-applications/analyze/components/TraceDetails/components/CallTree';
import { getColorPool } from 'in-services/util/ColorGenerator';
import TraceExamples from './TraceExamplesComponent';

const byServiceEndpointCombinationColorPool = getColorPool('serviceAndEndpointCombination');
const getColorByServiceAndEndpoint = ({ service, endpoint }) =>
  byServiceEndpointCombinationColorPool.getColorHex(`${service.id}__${endpoint.id}`);

export default {
  title: 'Templates|analyze/CallTree',
  component: CallTree,
  decorators: [withKnobs]
};

export function CallTreeStory() {
  return (
    <TraceExamples
      render={rootCall => (
        <CallTree
          selectedCall$={create()}
          openedCall$={create()}
          callTreeResult={{ data: rootCall, errors: [], progress: {} }}
          getColor={getColorByServiceAndEndpoint}
        />
      )}
    />
  );
}

export function LoadingStory() {
  return <CallTree selectedCall$={create()} callTreeResult={{ progress: { loading: true } }} />;
}

export function ErrorStory() {
  return (
    <CallTree
      selectedCall$={create()}
      callTreeResult={{ errors: [{ message: 'something went wrong' }, { message: 'also this should not happen' }] }}
    />
  );
}
