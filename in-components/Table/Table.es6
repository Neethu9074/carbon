import React from 'react';

import SortIndicator from 'in-components/Table/components/SortIndicator';
import { createStore } from 'in-components/Table/stores/content';
import Pagination from 'in-components/Pagination';

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    this.newStore(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.cols !== nextProps.cols || this.props.maxItemsPerPage !== nextProps.maxItemsPerPage) {
      this.dispose();
      this.newStore(nextProps);
    } else if (this.props.rows !== nextProps.rows) {
      this.store.onRowChange(nextProps.rows);
    }
  }

  newStore(props) {
    this.store = createStore({
      columnDefinitions: props.cols,
      maxItemsPerPage: props.maxItemsPerPage || 10,
      initialSortColumn: props.initialSortColumn || 0
    });
    this.store.onRowChange(props.rows);
    this.dataSubscription = this.store.sortedPagedData$.subscribe(data => this.setState({ data }));
  }

  dispose() {
    if (this.dataSubscription) {
      this.dataSubscription.dispose();
    }
    if (this.store) {
      this.store.dispose();
      this.store = null;
    }
  }

  componentWillUnmount() {
    this.dispose();
  }

  render() {
    const data = this.state.data;
    const cols = this.props.cols;

    if (!data || !this.store) {
      return null;
    }

    return (
      <div>
        <table>
          <thead>
            <tr>
              {cols.map((col, i) => (
                <th key={i}>
                  <SortIndicator
                    title={col.title}
                    index={i}
                    sortIndex={data.sortColumnIndex}
                    sortDirection={data.sortDirection}
                    onChangeSort={this.store.setSort}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.length === 0
              ? <tr>
                  <td colSpan={cols.length}>No data, sorry bro!</td>
                </tr>
              : null}

            {data.rows.length > 0
              ? data.rows.map(row => (
                  <tr key={row.key}>
                    {row.columns.map((column, i) => (
                      <td key={i}>
                        {column.content}
                      </td>
                    ))}
                  </tr>
                ))
              : null}
          </tbody>
        </table>

        <Pagination
          onPrevPage={this.store.onPrevPage}
          onNextPage={this.store.onNextPage}
          currentPage={data.page}
          pageCount={data.pageCount}
          ariaLabel="Pagination for previous table"
        />
      </div>
    );
  }
}
