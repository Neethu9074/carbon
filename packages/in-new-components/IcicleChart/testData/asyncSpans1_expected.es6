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
    duration: 6,
    errorCount: undefined,
    service: undefined,
    endpoint: undefined,
    parent: '1',
    depth: 1,
    x: 0.1,
    dx: 0.6
  },
  {
    id: '3',
    label: 'span4',
    start: 2,
    duration: 1,
    errorCount: undefined,
    service: undefined,
    endpoint: undefined,
    parent: '2',
    depth: 2,
    x: 0.2,
    dx: 0.1
  },
  {
    id: '4',
    label: 'span4',
    start: 4,
    duration: 2,
    errorCount: undefined,
    service: undefined,
    endpoint: undefined,
    parent: '1',
    depth: 2,
    x: 0.4,
    dx: 0.2
  }
];
