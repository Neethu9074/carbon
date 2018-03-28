export default {
  // key value pair
  // key: nice label which describes the trace case
  // value: the converted (!) trace json

  'trace with spans which reach beyond traces start time': {
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
  }
};
