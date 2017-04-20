import React from 'react';

import SortIndicator from 'in-components/Table/components/SortIndicator';
import { createStore } from 'in-components/Table/stores/content';
import Row from 'in-components/Table/components/Row';
import Pagination from 'in-components/Pagination';

import './Table.less';

const block = 'in-table';
const headerElement = `${block}__header`;
const headerLeftSideElement = `${block}__header-left`;
const headerRightSideElement = `${block}__header-right`;
const paginationElement = `${block}__element`;
const tableElement = `${block}__table`;
const cellElement = `${block}__cell`;
const rowElement = `${block}__row`;
const headerCellElement = `${block}__header-cell`;
const headerToggleCellElement = `${block}__header-toggle-cell`;

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
      maxItemsPerPage: props.maxItemsPerPage || 25,
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

    const supportsRowDetails = this.props.getRowDetails != null;
    const toggleRowDetails = supportsRowDetails ? this.store.toggleExpanded : null;
    const colCount = supportsRowDetails ? cols.length + 1 : cols.length;

    const rows = [];
    if (data.rows.length === 0) {
      rows.push(
        <tr className={rowElement} key="no-data">
          <td colSpan={colCount} className={cellElement}>No data, sorry bro!</td>
        </tr>
      );
    } else {
      for (let i = 0, length = data.rows.length; i < length; i++) {
        const rowData = data.rows[i];
        rows.push(
          <Row
            key={rowData.key}
            row={rowData}
            rowClassName={rowElement}
            cellClassName={cellElement}
            toggleRowDetails={toggleRowDetails}
          />
        );

        if (rowData.expanded) {
          rows.push(
            <tr className={rowElement} key={`${rowData.key}--expanded`}>
              <td className={cellElement} colSpan={colCount}>
                {this.props.getRowDetails(rowData.rowConfig)}
              </td>
            </tr>
          );
        }
      }
    }

    return (
      <div className={block}>
        <div className={headerElement}>
          <div className={headerLeftSideElement}>
            {this.props.leftHeader}
          </div>
          <div className={headerRightSideElement}>
            {this.props.rightHeader}
            <Pagination
              onPrevPage={this.store.onPrevPage}
              onNextPage={this.store.onNextPage}
              currentPage={data.page}
              pageCount={data.pageCount}
              ariaLabel="Pagination for previous table"
              className={paginationElement}
            />
          </div>
        </div>

        <table className={tableElement}>
          <thead>
            <tr>
              {supportsRowDetails ? <th className={headerToggleCellElement} /> : null}
              {cols.map((col, i) => (
                <th key={i} className={headerCellElement}>
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
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}
