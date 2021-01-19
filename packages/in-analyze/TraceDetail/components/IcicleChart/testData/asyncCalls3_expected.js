/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default [
  {
    children: [
      {
        children: [
          {
            children: [],
            id: '3',
            label: 'call3',
            start: 5,
            duration: 3
          }
        ],
        id: '2',
        label: 'call2',
        start: 2,
        duration: 8
      },
      {
        children: [],
        id: '4',
        label: 'call4',
        start: 4,
        duration: 3
      }
    ],
    id: '1',
    label: 'call1',
    start: 1,
    duration: 10,
    parent: null,
    depth: 0,
    x: 0,
    dx: 1,
    totalDuration: 10,
    traceStart: 1
  },
  {
    children: [
      {
        children: [],
        id: '3',
        label: 'call3',
        start: 5,
        duration: 3
      }
    ],
    id: '2',
    label: 'call2',
    start: 2,
    duration: 8,
    parent: '1',
    depth: 1,
    x: 0.1,
    dx: 0.8,
    totalDuration: 10,
    traceStart: 1
  },
  {
    children: [],
    id: '3',
    label: 'call3',
    start: 5,
    duration: 3,
    parent: '2',
    depth: 2,
    x: 0.4,
    dx: 0.3,
    totalDuration: 10,
    traceStart: 1
  },
  {
    children: [],
    id: '4',
    label: 'call4',
    start: 4,
    duration: 3,
    parent: '1',
    depth: 3,
    x: 0.3,
    dx: 0.3,
    totalDuration: 10,
    traceStart: 1
  }
];
