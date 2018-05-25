export default [
  {
    id: '1',
    label: 'call1',
    start: 100,
    duration: 100,
    parent: null,
    depth: 0,
    x: 0.25,
    dx: 0.5
  },
  {
    id: '2',
    label: 'call2',
    start: 50,
    duration: 20,
    parent: '1',
    depth: 1,
    x: 0,
    dx: 0.1
  },
  {
    id: '3',
    label: 'call3',
    start: 150,
    duration: 100,
    parent: '1',
    depth: 1,
    x: 0.5,
    dx: 0.5
  }
];
