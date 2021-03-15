/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default [
  {
    children: [
      {
        children: [],
        id: '2',
        label: 'call2',
        start: 50,
        duration: 20
      },
      {
        children: [],
        id: '3',
        label: 'call3',
        start: 150,
        duration: 100
      }
    ],
    id: '1',
    label: 'call1',
    start: 100,
    duration: 100,
    parent: null,
    depth: 0,
    x: 0.25,
    dx: 0.5,
    totalDuration: 200,
    traceStart: 50
  },
  {
    children: [],
    id: '2',
    label: 'call2',
    start: 50,
    duration: 20,
    parent: '1',
    depth: 1,
    x: 0,
    dx: 0.1,
    totalDuration: 200,
    traceStart: 50
  },
  {
    children: [],
    id: '3',
    label: 'call3',
    start: 150,
    duration: 100,
    parent: '1',
    depth: 1,
    x: 0.5,
    dx: 0.5,
    totalDuration: 200,
    traceStart: 50
  }
];
