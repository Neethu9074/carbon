/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default {
  id: '1',
  label: 'call1',
  start: 1,
  duration: 10,
  children: [
    {
      id: '2',
      label: 'call2',
      start: 2,
      duration: 8,
      children: [
        {
          id: '3',
          label: 'call3',
          start: 5,
          duration: 3,
          children: []
        }
      ]
    },
    {
      id: '4',
      label: 'call4',
      start: 4,
      duration: 3,
      children: []
    }
  ]
};
