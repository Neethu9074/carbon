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
            start: 3,
            duration: 1
          }
        ],
        id: '2',
        label: 'call2',
        start: 2,
        duration: 6
      },
      {
        children: [],
        id: '4',
        label: 'call4',
        start: 5,
        duration: 2
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
        start: 3,
        duration: 1
      }
    ],
    id: '2',
    label: 'call2',
    start: 2,
    duration: 6,
    parent: '1',
    depth: 1,
    x: 0.1,
    dx: 0.6,
    totalDuration: 10,
    traceStart: 1
  },
  {
    children: [],
    id: '3',
    label: 'call3',
    start: 3,
    duration: 1,
    parent: '2',
    depth: 2,
    x: 0.2,
    dx: 0.1,
    totalDuration: 10,
    traceStart: 1
  },
  {
    children: [],
    id: '4',
    label: 'call4',
    start: 5,
    duration: 2,
    parent: '1',
    depth: 2,
    x: 0.4,
    dx: 0.2,
    totalDuration: 10,
    traceStart: 1
  }
];
