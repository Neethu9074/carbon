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
      duration: 8,
      children: [
        {
          id: '3',
          label: 'span4',
          start: 4,
          duration: 3,
          children: []
        }
      ]
    },
    {
      id: '4',
      label: 'span4',
      start: 3,
      duration: 3,
      children: []
    }
  ]
};
