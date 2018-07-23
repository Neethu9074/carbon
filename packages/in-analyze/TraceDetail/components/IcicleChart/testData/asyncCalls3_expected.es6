export default [
  {
    id: '1',
    label: 'call1',
    start: 1,
    duration: 10,
    parent: null,
    depth: 0,
    x: 0,
    dx: 1
  },
  {
    id: '2',
    label: 'call2',
    start: 2,
    duration: 8,
    parent: '1',
    depth: 1,
    x: 0.1,
    dx: 0.8
  },
  {
    id: '3',
    label: 'call3',
    start: 5,
    duration: 3,
    parent: '2',
    depth: 2,
    x: 0.4,
    dx: 0.3
  },
  {
    id: '4',
    label: 'call4',
    start: 4,
    duration: 3,
    parent: '1',
    depth: 3,
    x: 0.3,
    dx: 0.3
  }
];
