export default {
  id: '1',
  type: 'span',
  children: [
    {
      id: 'Thread#run',
      type: 'stackTrace',
      stackTrace: [],
      children: [
        {
          id: 'ShoppingResource#checkout:63',
          type: 'stackTrace',
          stackTrace: [],
          children: [
            {
              id: 'ShoppingDao#store:45',
              type: 'stackTrace',
              stackTrace: [],
              children: [
                {
                  id: '2',
                  type: 'span',
                  children: []
                }
              ]
            },
            {
              id: 'ShoppingDao#update:90',
              type: 'stackTrace',
              stackTrace: [],
              children: [
                {
                  id: '3',
                  type: 'span',
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
