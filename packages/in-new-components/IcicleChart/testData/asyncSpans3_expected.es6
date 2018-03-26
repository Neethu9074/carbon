export default [
  {
    id: '1',
    label: 'span1',
    start: 0,
    duration: 10,
    errorCount: undefined,
    service: undefined,
    endpoint: undefined,
    parent: null,
    depth: 0,
    x: 0,
    dx: 1
  },
  {
    id: '2',
    label: 'span2',
    start: 1,
    duration: 8,
    errorCount: undefined,
    service: undefined,
    endpoint: undefined,
    parent: '1',
    depth: 1,
    x: 0.1,
    dx: 0.8
  },
  {
    id: '3',
    label: 'span4',
    start: 4,
    duration: 3,
    errorCount: undefined,
    service: undefined,
    endpoint: undefined,
    parent: '2',
    depth: 2,
    x: 0.4,
    dx: 0.3
  },
  {
    id: '4',
    label: 'span4',
    start: 3,
    duration: 3,
    errorCount: undefined,
    service: undefined,
    endpoint: undefined,
    parent: '1',
    depth: 3,
    x: 0.3,
    dx: 0.3
  }
];
