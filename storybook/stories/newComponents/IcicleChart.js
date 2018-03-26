import { storiesOf } from '@storybook/react';
import React from 'react';

import { deepFreeze } from 'in-services/util/object';
import IcicleChart from 'in-new-components/IcicleChart';
import { getColor } from 'in-applications/endpointTypes';

import Root from '../_helpers/Root';

const getColorByEndpointType = ({ endpoint }) => getColor(endpoint.type);

storiesOf('newComponents/IcicleChart', module)
  .add('Default', () => <Default />)
  .add('Synchronous spans', () => <SynchronousSpans />)
  .add('Asynchronous spans', () => <AsynchronousSpans />)
  .add('Many small spans', () => <ManySmallSpans />);

function Default() {
  const rootSpan = deepFreeze({
    id: 'root',
    label: 'GET /groundwork/index.html',
    start: 1521621596210,
    duration: 2503,
    networkTime: null,
    errorCount: 0,
    batchSize: 0,
    batchSelfTime: null,
    service: {
      id: 'qa-21-groundwork-web-1.4.443',
      label: 'qa-21-groundwork-web-1.4.443',
      types: ['HTTP']
    },
    endpoint: {
      id: 'GET /groundwork/index.html',
      label: 'GET /groundwork/index.html',
      type: 'HTTP'
    },
    children: [
      {
        id: 'redis-rest-cache-1521621596230',
        label: 'GET',
        start: 1521621596230,
        duration: 0,
        networkTime: null,
        errorCount: 0,
        batchSize: 0,
        batchSelfTime: null,
        service: {
          id: 'redis://dev-rest-cache3.hxfvbt.ng.0001.use1.cache.amazonaws.com:6379',
          label: 'redis://dev-rest-cache3.hxfvbt.ng.0001.use1.cache.amazonaws.com:6379',
          types: ['DATABASE']
        },
        endpoint: {
          id: 'GET',
          label: 'GET',
          type: 'DATABASE'
        },
        children: []
      }, {
        id: 'redis-rest-cache-1521621596260',
        label: 'GET',
        start: 1521621596260,
        duration: 0,
        networkTime: null,
        errorCount: 0,
        batchSize: 0,
        batchSelfTime: null,
        service: {
          id: 'redis://dev-rest-cache3.hxfvbt.ng.0001.use1.cache.amazonaws.com:6379',
          label: 'redis://dev-rest-cache3.hxfvbt.ng.0001.use1.cache.amazonaws.com:6379',
          types: ['DATABASE']
        },
        endpoint: {
          id: 'GET',
          label: 'GET',
          type: 'DATABASE'
        },
        children: []
      }, {
        id: 'redis-rest-cache-1521621596310',
        label: 'GET',
        start: 1521621596310,
        duration: 0,
        networkTime: null,
        errorCount: 0,
        batchSize: 0,
        batchSelfTime: null,
        service: {
          id: 'redis://qa-us-west-2-cms.j4pkyj.ng.0001.use1.cache.amazonaws.com:6379',
          label: 'redis://qa-us-west-2-cms.j4pkyj.ng.0001.use1.cache.amazonaws.com:6379',
          types: ['DATABASE']
        },
        endpoint: {
          id: 'GET',
          label: 'GET',
          type: 'DATABASE'
        },
        children: []
      }, {
        id: 'put-creative-config-exit',
        label: 'PUT /api/v1/creative/config',
        start: 1521621598220,
        duration: 81,
        networkTime: null,
        errorCount: 1,
        batchSize: 0,
        batchSelfTime: null,
        service: {
          id: 'qa-srs11-adcreative-config-media-rest-web-1.1.49',
          label: 'qa-srs11-adcreative-config-media-rest-web-1.1.49',
          types: ['HTTP']
        },
        endpoint: {
          id: 'PUT /api/v1/creative/config',
          label: 'PUT /api/v1/creative/config',
          type: 'HTTP'
        },
        children: [
          {
            id: 'put-creative-config-entry',
            label: 'PUT /api/v1/creative/config',
            start: 1521621598260,
            duration: 2,
            networkTime: null,
            errorCount: 0,
            batchSize: 0,
            batchSelfTime: null,
            service: {
              id: 'qa-srs11-adcreative-config-media-rest-web-1.1.49',
              label: 'qa-srs11-adcreative-config-media-rest-web-1.1.49',
              types: ['HTTP']
            },
            endpoint: {
              id: 'PUT /api/v1/creative/config',
              label: 'PUT /api/v1/creative/config',
              type: 'HTTP'
            },
            children: [
              {
                id: 'mongo',
                label: 'command',
                start: 1521621598260,
                duration: 1,
                networkTime: null,
                errorCount: 0,
                batchSize: 0,
                batchSelfTime: null,
                service: {
                  id: 'qa-us-west-configs',
                  label: 'qa-us-west-configs',
                  types: ['DATABASE']
                },
                endpoint: {
                  id: 'creative',
                  label: 'creative',
                  type: 'DATABASE'
                },
                children: []
              }
            ]
          }
        ]
      }, {
        id: 'redis-rest-cache-1521621598310',
        label: 'GET',
        start: 1521621598310,
        duration: 0,
        networkTime: null,
        errorCount: 0,
        batchSize: 0,
        batchSelfTime: null,
        service: {
          id: 'redis://qa-us-west-2-cms.j4pkyj.ng.0001.use1.cache.amazonaws.com:6379',
          label: 'redis://qa-us-west-2-cms.j4pkyj.ng.0001.use1.cache.amazonaws.com:6379',
          types: ['DATABASE']
        },
        endpoint: {
          id: 'GET',
          label: 'GET',
          type: 'DATABASE'
        },
        children: []
      }, {
        id: 'post-cmsroute-exit',
        label: 'POST /api/wtf/v2/cmsroute',
        start: 1521621598610,
        duration: 7,
        networkTime: null,
        errorCount: 5,
        batchSize: 0,
        batchSelfTime: null,
        service: {
          id: 'qa-21-wtf-routing-web-1.7.13',
          label: 'qa-21-wtf-routing-web-1.7.13',
          types: ['HTTP']
        },
        endpoint: {
          id: 'POST /api/wtf/v2/cmsroute',
          label: 'POST /api/wtf/v2/cmsroute',
          type: 'HTTP'
        },
        children: [
          {
            id: 'post-cmsroute-entry',
            label: 'POST /api/wtf/v2/cmsroute',
            start: 1521621598613,
            duration: 2,
            networkTime: null,
            errorCount: 0,
            batchSize: 0,
            batchSelfTime: null,
            service: {
              id: 'qa-21-wtf-routing-web-1.7.13',
              label: 'qa-21-wtf-routing-web-1.7.13',
              types: ['HTTP']
            },
            endpoint: {
              id: 'POST /api/wtf/v2/cmsroute',
              label: 'POST /api/wtf/v2/cmsroute',
              type: 'HTTP'
            },
            children: []
          }
        ]
      }
    ]
  });
  return (
    <Root>
      <IcicleChart rootSpan={rootSpan} getColor={getColorByEndpointType} />
    </Root>
  );
}

function SynchronousSpans() {

  const rootSpan = deepFreeze({
    id: '1',
    label: 'span1',
    start: 0,
    duration: 10,
    children: [
      {
        id: '2',
        label: 'span2',
        start: 1,
        duration: 9,
        children: [
          {
            id: '3',
            label: 'span3',
            start: 2,
            duration: 3,
            errorCount: 1,
            children: [
              {
                id: '6',
                label: 'span6',
                start: 2.5,
                duration: 1.5,
                children: []
              }
            ]
          },
          {
            id: '4',
            label: 'span4',
            start: 6,
            duration: 2,
            children: []
          },
          {
            id: '5',
            label: 'span5',
            start: 9,
            duration: 0.1,
            errorCount: 2,
            children: []
          }
        ]
      }
    ]
  });


  return (
    <Root>
      <IcicleChart rootSpan={rootSpan} />
    </Root>
  );
}


function AsynchronousSpans() {

  const rootSpan = deepFreeze({
    id: '1',
    label: 'span1',
    start: 0,
    duration: 10,
    children: [
      {
        id: '2',
        label: 'span2',
        start: 1,
        duration: 7,
        children: [
          {
            id: '4',
            label: 'span4',
            start: 4.5,
            duration: 3,
            children: [
              {
                id: '7',
                label: 'span7',
                start: 5.5,
                duration: 0.5,
                children: [
                ]
              }
            ]
          }
        ]
      },
      {
        id: '3',
        label: 'span3',
        start: 2,
        duration: 0.5,
        children: []
      },
      {
        id: '5',
        label: 'span5',
        start: 3.5,
        duration: 3,
        children: [
          {
            id: '6',
            label: 'span6',
            start: 4,
            duration: 1,
            children: []
          }
        ]
      }
    ]
  });


  return (
    <Root>
      <IcicleChart rootSpan={rootSpan} />
    </Root>
  );
}

function ManySmallSpans() {

  const rootSpan = deepFreeze({
    id: '1',
    label: 'span1',
    start: 0,
    duration: 500,
    children: [
      {
        id: '2',
        label: 'span2',
        start: 20,
        duration: 0,
        children: []
      },
      {
        id: '3',
        label: 'span3',
        start: 21,
        duration: 0,
        children: []
      },
      {
        id: '4',
        label: 'span4',
        start: 22,
        duration: 1,
        children: []
      },
      {
        id: '9',
        label: 'span9',
        start: 22,
        duration: 10,
        children: []
      },
      {
        id: '5',
        label: 'span5',
        start: 23,
        duration: 1,
        children: []
      },
      {
        id: '6',
        label: 'span6',
        start: 24,
        duration: 1,
        children: []
      },
      {
        id: '7',
        label: 'span7',
        start: 25,
        duration: 2,
        children: [
          {
            id: '8',
            label: 'span8',
            start: 26,
            duration: 0.5,
            children: []
          }
        ]
      }
    ]
  });


  return (
    <Root>
      <IcicleChart rootSpan={rootSpan} />
    </Root>
  );
}
