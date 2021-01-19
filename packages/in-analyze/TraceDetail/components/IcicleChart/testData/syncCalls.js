/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default {
  id: '1',
  label: 'call1',
  start: 100,
  duration: 10,
  children: [
    {
      id: '2',
      label: 'call2',
      start: 101,
      duration: 9,
      children: [
        {
          id: '3',
          label: 'call3',
          start: 102,
          duration: 3,
          children: [
            {
              id: '6',
              label: 'call6',
              start: 102.5,
              duration: 1.5,
              children: []
            }
          ]
        },
        {
          id: '4',
          label: 'call4',
          start: 106,
          duration: 2,
          children: []
        },
        {
          id: '5',
          label: 'call5',
          start: 109,
          duration: 0.5,
          children: []
        }
      ]
    }
  ]
};
