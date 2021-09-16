/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default {
  // key value pair
  // key: nice label which describes the trace case
  // value: the converted (!) trace json

  'Synchronous spans': {
    id: '1',
    label: 'span1',
    start: 0.1,
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
                children: [],
                service: {},
                endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
              }
            ],
            service: {},
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          },
          {
            id: '4',
            label: 'span4',
            start: 6,
            duration: 2,
            children: [],
            service: {},
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          },
          {
            id: '5',
            label: 'span5',
            start: 9,
            duration: 0.1,
            errorCount: 2,
            children: [],
            service: {},
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          }
        ],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      }
    ],
    service: {},
    endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
  },

  'Asynchronous spans': {
    id: '1',
    label: 'span1',
    start: 0.1,
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
                children: [],
                service: {},
                endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
              }
            ],
            service: {},
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          }
        ],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        id: '3',
        label: 'span3',
        start: 2,
        duration: 0.5,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
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
            children: [],
            service: {},
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          }
        ],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      }
    ],
    service: {},
    endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
  },

  'Many small spans': {
    id: '1',
    label: 'span1',
    start: 0.1,
    duration: 500,
    children: [
      {
        id: '2',
        label: 'span2',
        start: 20,
        duration: 0,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        id: '3',
        label: 'span3',
        start: 21,
        duration: 0,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        id: '4',
        label: 'span4',
        start: 22,
        duration: 1,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        id: '9',
        label: 'span9',
        start: 22,
        duration: 10,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        id: '5',
        label: 'span5',
        start: 23,
        duration: 1,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        id: '6',
        label: 'span6',
        start: 24,
        duration: 1,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
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
            children: [],
            service: {},
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          }
        ],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      }
    ],
    service: {},
    endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
  },

  'Trace with spans which reach beyond traces end time': {
    start: 1522218970808,
    duration: 64,
    batchSize: 0,
    errorCount: 0,
    children: [
      {
        parentId: '-5208440297566741775',
        start: 1522218970812,
        duration: 53,
        batchSize: 1,
        errorCount: 0,
        children: [
          {
            parentId: '3832834084768639079',
            start: 1522218970813,
            duration: 52,
            batchSize: 1,
            errorCount: 0,
            children: [
              {
                parentId: '2432248810689121703',
                start: 1522218970814,
                duration: 5,
                batchSize: 2,
                batchSelfTime: 2,
                errorCount: 0,
                children: [],
                label: 'elasticsearch',
                service: { id: '3750689595639264055', label: 'elasticsearch', type: 'exit' },
                endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
              }
            ],
            label: 'spring-web',
            service: { id: '2432248810689121703', label: 'spring-web', type: 'entry' },
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          }
        ],
        label: 'spring-rest',
        service: { id: '3832834084768639079', label: 'spring-rest', type: 'exit' },
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        parentId: '-5208440297566741775',
        start: 1522218970869,
        duration: 3,
        batchSize: 1,
        errorCount: 0,
        children: [
          {
            parentId: '5786057676256496293',
            start: 1522218970874,
            duration: 1,
            batchSize: 1,
            errorCount: 0,
            children: [
              {
                parentId: '5243157882291214357',
                start: 1522218970874,
                duration: 1,
                batchSize: 1,
                errorCount: 0,
                children: [],
                label: 'jdbc',
                service: { id: '-635485226397179343', label: 'jdbc', type: 'exit' },
                endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
              }
            ],
            label: 'spring-web',
            service: { id: '5243157882291214357', label: 'spring-web', type: 'entry' },
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          }
        ],
        label: 'spring-rest',
        service: { id: '5786057676256496293', label: 'spring-rest', type: 'exit' },
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        parentId: '-5208440297566741775',
        start: 1522218970872,
        duration: 0,
        batchSize: 1,
        errorCount: 0,
        children: [
          {
            parentId: '3933988687993061381',
            start: 1522218970876,
            duration: 0,
            batchSize: 1,
            errorCount: 0,
            children: [],
            label: 'rabbitmq',
            service: { id: '-9130696408165262667', label: 'rabbitmq', type: 'entry' },
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          }
        ],
        label: 'rabbitmq',
        service: { id: '3933988687993061381', label: 'rabbitmq', type: 'exit' },
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      }
    ],
    label: 'spring-web',
    service: { id: '-5208440297566741775', label: 'spring-web', type: 'entry' },
    endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
  },

  'Trace with spans which reach before traces start time': {
    id: '1',
    label: 'span1',
    start: 100,
    duration: 100,
    children: [
      {
        id: '2',
        label: 'span2',
        start: 80,
        duration: 30,
        children: [
          {
            id: '4',
            label: 'span4',
            start: 85,
            duration: 10,
            children: [],
            service: {},
            endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
          }
        ],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        id: '3',
        label: 'span3',
        start: 90,
        duration: 15,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      }
    ],
    service: {},
    endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
  },

  'Trace with missing root span': {
    id: 'fake_root',
    label: 'Root call not yet received',
    children: [
      {
        id: '2',
        label: 'span2',
        start: 80,
        duration: 20,
        children: [
          {
            id: '4',
            label: 'span4',
            start: 85,
            duration: 5,
            children: [],
            service: {},
            endpoint: { id: 'unknown', label: 'Unknown', type: 'DATABASE' }
          }
        ],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      },
      {
        id: '3',
        label: 'span3',
        start: 110,
        duration: 5,
        children: [],
        service: {},
        endpoint: { id: 'unknown', label: 'Unknown', type: 'HTTP' }
      }
    ],
    service: {},
    endpoint: { id: 'unknown', label: 'Unknown', type: 'Unspecified' }
  },

  'Trace with logs': {
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
        id: 'redis-rest-cache-1521621596260',
        label: 'GET',
        start: 1521621596260,
        duration: 0,
        networkTime: null,
        errorCount: 0,
        batchSize: 0,
        model: 'LOG',
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
          },
          {
            id: 'put-creative-config-entry',
            label: 'PUT /api/v1/creative/config',
            start: 1521621598260,
            duration: 2,
            networkTime: null,
            errorCount: 1,
            batchSize: 0,
            batchSelfTime: null,
            model: 'LOG',
            service: {
              id: 'qa-srs11-adcreative-config-media-rest-web-1.1.49',
              label: 'qa-srs11-adcreative-config-media-rest-web-1.1.49',
              types: ['HTTP']
            },
            endpoint: {
              id: 'PUT /api/v1/creative/config',
              label: 'PUT /api/v1/creative/config',
              type: 'HTTP'
            }
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
  }
};
