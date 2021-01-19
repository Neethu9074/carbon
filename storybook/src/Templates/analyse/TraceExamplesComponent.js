/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withState } from 'recompose';
import React from 'react';

import { deepFreeze } from 'in-services/util/object';
import traceExamples from './traceExamples';
import InputHeader from './InputHeader';

export default withState(
  'selectedValue',
  'setSelectedValue',
  'custom'
)(
  withState(
    'inputValue',
    'setInputValue',
    ''
  )(function TraceExamplesComponent({ selectedValue, setSelectedValue, inputValue, setInputValue, render }) {
    const options = ['custom'];
    const exampleKeys = Object.keys(traceExamples);
    for (let i = 0; i < exampleKeys.length; i++) {
      const key = exampleKeys[i];
      options.push(key);
    }

    let rootCall;
    if (selectedValue !== 'custom') {
      rootCall = traceExamples[selectedValue];
    } else if (inputValue) {
      try {
        rootCall = deepFreeze(JSON.parse(inputValue));
      } catch (e) {
        rootCall = null;
      }
    } else {
      rootCall = defaultTraceExample;
    }

    return (
      <div>
        <InputHeader>
          <select
            id={1}
            value={selectedValue}
            placeholder=""
            options={options}
            onChange={e => setSelectedValue(e.target.value)}
          >
            {options.map(option => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          {selectedValue === 'custom' && (
            <div>
              <input
                style={{
                  width: '100%',
                  marginTop: 16,
                  height: '50px'
                }}
                type="text"
                id={2}
                placeholder="paste JSON here"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            </div>
          )}
        </InputHeader>
        {render(rootCall)}
      </div>
    );
  })
);

const defaultTraceExample = {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
};
