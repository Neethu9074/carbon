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
