export default {
  id: '1',
  label: 'call1',
  start: 0,
  duration: 10,
  children: [
    {
      id: '2',
      label: 'call2',
      start: 1,
      duration: 8,
      children: [
        {
          id: '3',
          label: 'call4',
          start: 6,
          duration: 2,
          children: []
        }
      ]
    },
    {
      id: '4',
      label: 'call4',
      start: 3,
      duration: 2,
      children: []
    }
  ]
};
