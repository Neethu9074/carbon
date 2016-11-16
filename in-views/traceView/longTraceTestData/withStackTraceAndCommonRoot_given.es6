export default {
  'traceId': '1',
  'start': 1468562943766,
  'spanId': '1',
  'error': false,
  'data': {},
  'duration': 108,
  'async': false,
  'name': 'spring-web',
  'stackTrace': [
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
  'childSpans': [
    {
      'start': 1468562943771,
      'spanId': '2',
      'error': false,
      'data': {},
      'name': 'jdbc',
      'duration': 20,
      'async': false,
      'stackTrace': [
        {
          c: 'ShoppingDao',
          m: 'store',
          n: 45
        },
        {
          c: 'ShoppingResource',
          m: 'checkout',
          n: 65
        },
        {
          c: 'Thread',
          m: 'run'
        }
      ],
      'childSpans': []
    },
    {
      'start': 1468562943771,
      'spanId': '3',
      'error': false,
      'data': {},
      'name': 'jdbc',
      'duration': 20,
      'async': false,
      'stackTrace': [
        {
          c: 'ShoppingDao',
          m: 'update',
          n: 90
        },
        {
          c: 'ShoppingResource',
          m: 'checkout',
          n: 65
        },
        {
          c: 'Thread',
          m: 'run'
        }
      ],
      'childSpans': []
    }
  ]
};
