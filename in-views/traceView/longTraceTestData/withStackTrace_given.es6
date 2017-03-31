import { SPAN_KINDS } from 'in-sdk/tracing';

export default {
  traceId: '2097887366255533505',
  start: 1468562943766,
  spanId: '2097887366255533505',
  error: false,
  data: {},
  duration: 108,
  async: false,
  name: 'url',
  stackTrace: [],
  kind: SPAN_KINDS.EXIT,
  childSpans: [
    {
      start: 1468562943771,
      spanId: '5449855402949182823',
      error: false,
      data: {},
      name: 'rabbitMq',
      duration: 20,
      async: false,
      kind: SPAN_KINDS.EXIT,
      stackTrace: [
        {
          c: 'ShoppingResource',
          m: 'checkout',
          n: 63
        },
        {
          c: 'Thread',
          m: 'run'
        }
      ],
      childSpans: []
    }
  ]
};
