/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default [
  {
    id: '1',
    label: 'call1',
    start: 100,
    duration: 0,
    parent: null,
    depth: 0,
    x: 0,
    dx: 1,
    totalDuration: 0,
    traceStart: 100,
    children: [
      {
        children: [],
        duration: 0,
        id: '2',
        label: 'call2',
        start: 100
      },
      {
        children: [],
        duration: 0,
        id: '3',
        label: 'call3',
        start: 100
      }
    ]
  },
  {
    id: '2',
    label: 'call2',
    start: 100,
    duration: 0,
    parent: '1',
    depth: 1,
    x: 0,
    dx: 1,
    totalDuration: 0,
    traceStart: 100,
    children: []
  },
  {
    id: '3',
    label: 'call3',
    start: 100,
    duration: 0,
    parent: '1',
    depth: 2,
    x: 0,
    dx: 1,
    totalDuration: 0,
    traceStart: 100,
    children: []
  }
];
