/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export default [
  {
    id: '1',
    label: 'call1',
    start: 100,
    duration: 10,
    parent: null,
    depth: 0,
    x: 0,
    dx: 1,
    totalDuration: 10,
    traceStart: 100,
    children: [
      {
        id: '2',
        label: 'call2',
        start: 101,
        duration: 9,
        children: [
          {
            children: [
              {
                children: [],
                duration: 1.5,
                id: '6',
                label: 'call6',
                start: 102.5
              }
            ],
            duration: 3,
            id: '3',
            label: 'call3',
            start: 102
          },
          {
            children: [],
            duration: 2,
            id: '4',
            label: 'call4',
            start: 106
          },
          {
            children: [],
            duration: 0.5,
            id: '5',
            label: 'call5',
            start: 109
          }
        ]
      }
    ]
  },
  {
    id: '2',
    label: 'call2',
    start: 101,
    duration: 9,
    parent: '1',
    depth: 1,
    x: 0.1,
    dx: 0.9,
    totalDuration: 10,
    traceStart: 100,
    children: [
      {
        children: [
          {
            children: [],
            duration: 1.5,
            id: '6',
            label: 'call6',
            start: 102.5
          }
        ],
        duration: 3,
        id: '3',
        label: 'call3',
        start: 102
      },
      {
        children: [],
        duration: 2,
        id: '4',
        label: 'call4',
        start: 106
      },
      {
        children: [],
        duration: 0.5,
        id: '5',
        label: 'call5',
        start: 109
      }
    ]
  },
  {
    id: '3',
    label: 'call3',
    start: 102,
    duration: 3,
    parent: '2',
    depth: 2,
    x: 0.2,
    dx: 0.3,
    children: [
      {
        children: [],
        id: '6',
        label: 'call6',
        start: 102.5,
        duration: 1.5
      }
    ],
    totalDuration: 10,
    traceStart: 100
  },
  {
    id: '6',
    label: 'call6',
    start: 102.5,
    duration: 1.5,
    parent: '3',
    depth: 3,
    x: 0.25,
    dx: 0.15,
    children: [],
    totalDuration: 10,
    traceStart: 100
  },
  {
    id: '4',
    label: 'call4',
    start: 106,
    duration: 2,
    parent: '2',
    depth: 2,
    x: 0.6,
    dx: 0.2,
    children: [],
    totalDuration: 10,
    traceStart: 100
  },
  {
    id: '5',
    label: 'call5',
    start: 109,
    duration: 0.5,
    parent: '2',
    depth: 2,
    x: 0.9,
    dx: 0.05,
    children: [],
    totalDuration: 10,
    traceStart: 100
  }
];
