import invariant from 'invariant';
import React from 'react';

import { createStore } from 'in-components/Table/stores/content';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.store = this.newStore(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cols !== nextProps.cols || this.props.maxItemsPerPage !== nextProps.maxItemsPerPage) {
      this.disposeStore();
      this.newStore(nextProps);
    } else if (this.props.rows !== nextProps.rows) {
      this.store.onRowChange(nextProps.rows);
    }
  }

  newStore(props) {
    if (__DEV__) {
      validateProps(props);
    }
    this.store = createStore({
      columnDefinitions: props.cols,
      maxItemsPerPage: props.maxItemsPerPage || 10
    });
    this.store.onRowChange(props.rows);
  }

  disposeStore() {
    if (this.store) {
      this.store.dispose();
      this.store = null;
    }
  }

  componentWillUnmount() {
    this.disposeStore();
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Foo</td>
            <td>2</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

function validateProps(props) {
  invariant(props.cols instanceof Array, 'cols must be an array');
  props.cols.forEach(validateCol);
  invariant(props.rows instanceof Array, 'rows must be an array');
  props.rows.forEach(validateRow);
}

function validateCol(col) {
  invariant(typeof col.title === 'string', 'col.title must be a string');
  invariant(['string', 'metric'].indexOf(col.type) !== -1, 'col.type must be string|metric');

  if (col.type === 'string') {
    invariant(
      typeof col.typeArgs.getValue === 'function',
      'Columns with type=string must have a getValue(row) function.'
    );
    invariant(
      typeof col.typeArgs.getContent === 'function',
      'Columns with type=string must have a getContent(row, value) function.'
    );
  } else if (col.type === 'metric') {
    invariant(
      typeof col.typeArgs.getSnapshotId === 'function',
      'Columns with type=metric must have a getSnapshotId(row) function.'
    );
    invariant(
      typeof col.typeArgs.getMetricName === 'function',
      'Columns with type=metric must have a getMetricName(row) function.'
    );
    invariant(
      typeof col.typeArgs.formatter === 'object' &&
        typeof col.typeArgs.formatter.compact === 'function' &&
        typeof col.typeArgs.formatter.detailed === 'function',
      'Columns with type=metric must have a formatter in the form of {compact, detailed}'
    );
    invariant(
      ['mean', 'count', 'adjustedCount', 'max'].indexOf(col.typeArgs.timeWindowAggregation) !== -1,
      'Columns with type=metric must have a supported timeWindowAggregation, i.e. mean|count|adjustedCount|max'
    );
  }
}

function validateRow(row) {
  invariant(typeof row.key === 'string', 'row.key must be a string');
}
