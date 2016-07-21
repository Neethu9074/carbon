export default {
  'traceId': '2097887366255533505',
  'start': 1468562943766,
  'spanId': '2097887366255533505',
  'error': false,
  'data': {},
  'duration': 108,
  'async': false,
  'name': 'url',
  'stackTrace': [],
  'childSpans': [
    {
      'start': 1468562943771,
      'spanId': '5449855402949182823',
      'error': false,
      'data': {},
      'name': 'rabbitMq',
      'duration': 20,
      'async': false,
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
      'childSpans': []
    }
  ]
};
