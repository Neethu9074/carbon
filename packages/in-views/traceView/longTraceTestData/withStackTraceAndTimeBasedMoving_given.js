import { SPAN_KINDS } from 'in-sdk/tracing';

export default {
  traceId: '1',
  start: 10,
  spanId: '1',
  async: false,
  name: 'spring-web',
  kind: SPAN_KINDS.ENTRY,
  stackTrace: [
    {
      c: 'Thread',
      m: ''
    }
  ],
  childSpans: [
    {
      traceId: '1',
      start: 11,
      spanId: '2',
      async: false,
      name: 'hc',
      kind: SPAN_KINDS.EXIT,
      stackTrace: [
        {
          c: 'ClassC',
          m: ''
        },
        {
          c: 'ClassB',
          m: ''
        },
        {
          c: 'ClassA',
          m: ''
        },
        {
          c: 'Thread',
          m: ''
        }
      ],
      childSpans: []
    },
    {
      traceId: '1',
      start: 12,
      spanId: '3',
      async: false,
      name: 'hc',
      kind: SPAN_KINDS.EXIT,
      stackTrace: [
        {
          c: 'ClassD',
          m: ''
        },
        {
          c: 'ClassA',
          m: ''
        },
        {
          c: 'Thread',
          m: ''
        }
      ],
      childSpans: []
    },
    {
      traceId: '1',
      start: 13,
      spanId: '4',
      async: false,
      name: 'hc',
      kind: SPAN_KINDS.EXIT,
      stackTrace: [
        {
          c: 'ClassE',
          m: ''
        },
        {
          c: 'ClassB',
          m: ''
        },
        {
          c: 'ClassA',
          m: ''
        },
        {
          c: 'Thread',
          m: ''
        }
      ],
      childSpans: []
    }
  ]
};
