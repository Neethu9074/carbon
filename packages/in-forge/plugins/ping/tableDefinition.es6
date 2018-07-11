export default {
  initialSortColumn: 1,
  initialSortDirection: 'asc',

  cols: [
    {
      title: 'Endpoint',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['endpoint']);
        }
      }
    },
    {
      title: 'Host',
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.snapshot.getIn(['host']);
        }
      }
    }
  ]
};
