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
    ]
  }

};
