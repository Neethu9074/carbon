export default {
  id: '1',
  label: 'span1',
  start: 100,
  duration: 10,
  children: [
    {
      id: '2',
      label: 'span2',
      start: 101,
      duration: 9,
      children: [
        {
          id: '3',
          label: 'span3',
          start: 102,
          duration: 3,
          children: [
            {
              id: '6',
              label: 'span6',
              start: 102.5,
              duration: 1.5,
              children: []
            }
          ]
        },
        {
          id: '4',
          label: 'span4',
          start: 106,
          duration: 2,
          children: []
        },
        {
          id: '5',
          label: 'span5',
          start: 109,
          duration: 0.5,
          children: []
        }
      ]
    }
  ]
};
