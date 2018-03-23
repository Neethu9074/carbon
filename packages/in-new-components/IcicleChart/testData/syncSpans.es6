export default {
  id: '1',
  label: 'span1',
  start: 0,
  duration: 10,
  children: [
    {
      id: '2',
      label: 'span2',
      start: 1,
      duration: 9,
      children: [
        {
          id: '3',
          label: 'span3',
          start: 2,
          duration: 3,
          children: [
            {
              id: '6',
              label: 'span6',
              start: 2.5,
              duration: 1.5,
              children: []
            }
          ]
        },
        {
          id: '4',
          label: 'span4',
          start: 6,
          duration: 2,
          children: []
        },
        {
          id: '5',
          label: 'span5',
          start: 9,
          duration: 0.5,
          children: []
        }
      ]
    }
  ]
};
