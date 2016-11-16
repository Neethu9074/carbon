export default {
  id: '1',
  type: 'span',
  children: [
    {
      id: 'ClassA#',
      type: 'stackTrace',
      children: [
        {
          id: 'ClassB#',
          type: 'stackTrace',
          children: [
            {
              id: 'ClassC#',
              type: 'stackTrace',
              children: [
                {
                  id: '2',
                  type: 'span',
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 'ClassD#',
          type: 'stackTrace',
          children: [
            {
              id: '3',
              type: 'span',
              children: []
            }
          ]
        },
        {
          id: 'ClassB#',
          type: 'stackTrace',
          children: [
            {
              id: 'ClassE#',
              type: 'stackTrace',
              children: [
                {
                  id: '4',
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
