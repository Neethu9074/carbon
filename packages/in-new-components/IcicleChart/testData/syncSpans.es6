export default {
  id: '1',
  start: 0,
  duration: 10,
  children: [
    {
      id: '2',
      start: 1,
      duration: 9,
      children: [
        {
          id: '3',
          start: 2,
          duration: 3,
          children: [
            {
              id: '6',
              start: 2.5,
              duration: 1.5,
              children: []
            }
          ]
        },
        {
          id: '4',
          start: 6,
          duration: 2,
          children: []
        },
        {
          id: '5',
          start: 9,
          duration: 0.5,
          children: []
        }
      ]
    }
  ]
};
