export default {
  id: '1',
  type: 'span',
  children: [
    {
      id: 'Thread#run;ShoppingResource#checkout:63',
      type: 'stackTrace',
      children: [
        {
          id: 'ShoppingDao#store:45',
          type: 'stackTrace',
          children: [
            {
              id: '2',
              type: 'span',
              children: [
                {
                  id: 'ShoppingDao#update:90;ShoppingDao#update:95;PerfReporter#report:32',
                  type: 'stackTrace',
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
    }
  ]
};
