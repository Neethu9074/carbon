import React from 'react';

import Table from 'in-components/Table';

import locals from './SearchableTable.mless';

export default class SearchableTable extends React.Component {
  state = {
    filter: ''
  };

  render() {
    const { rows, cols, maxItemsPerPage, initialSortColumn } = this.props;

    return (
      <div className={locals.table}>
        <div className={locals.header}>
          <input
            type="search"
            value={this.state.filter}
            onChange={e =>
              this.setState({
                filter: e.target.value
              })
            }
            placeholder="Search…"
            className={locals.filter}
          />
        </div>
        <Table
          filter={this.state.filter}
          maxItemsPerPage={maxItemsPerPage}
          cols={cols}
          rows={rows}
          initialSortColumn={initialSortColumn}
        />
      </div>
    );
  }
}
