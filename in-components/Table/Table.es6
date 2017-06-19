import React from 'react';

import SortIndicator from 'in-components/Table/components/SortIndicator';
import { createStore } from 'in-components/Table/stores/content';
import { joinClassNames } from 'in-services/util/classnames';
import Row from 'in-components/Table/components/Row';
import shallowEquals from 'fbjs/lib/shallowEqual';
import Pagination from 'in-components/Pagination';

import './Table.less';

const block = 'in-table';
const headerElement = `${block}__header`;
const headerLeftSideElement = `${block}__header-left`;
const headerRightSideElement = `${block}__header-right`;
const paginationElement = `${block}__element`;
const tableElement = `${block}__table`;
const cellElement = `${block}__cell`;
const expandedCellElement = `${cellElement} ${cellElement}--expanded`;
const rowElement = `${block}__row`;
const expandedRowElement = `${rowElement} ${rowElement}--expanded`;
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
    if (!shallowEquals(this.props.cols, nextProps.cols) || this.props.maxItemsPerPage !== nextProps.maxItemsPerPage) {
      this.dispose();
      this.newStore(nextProps);
    } else {
      if (this.props.rows !== nextProps.rows) {
        this.store.onRowChange(nextProps.rows);
      }
      if (!shallowEquals(this.props.selectedRowKeys, nextProps.selectedRowKeys)) {
        this.store.onSelectedRowKeyChange(nextProps.selectedRowKeys);
      }
    }
  }

  newStore(props) {
    this.store = createStore({
      columnDefinitions: props.cols,
      maxItemsPerPage: props.maxItemsPerPage || 10,
      initialSortColumn: props.initialSortColumn || 0,
      initialSortDirection: props.initialSortDirection || 'asc'
    });
    this.store.onRowChange(props.rows);
    this.store.onSelectedRowKeyChange(props.selectedRowKeys);
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
          <td colSpan={colCount} className={cellElement}>{this.props.noDataText || 'No data.'}</td>
        </tr>
      );
    } else {
      for (let i = 0, length = data.rows.length; i < length; i++) {
        const rowData = data.rows[i];
        let rowClassName = rowElement;
        if (rowData.rowConfig.className) {
          rowClassName += ` ${rowData.rowConfig.className}`;
        }
        rows.push(
          <Row
            key={rowData.key}
            row={rowData}
            rowClassName={rowClassName}
            cellClassName={cellElement}
            toggleRowDetails={toggleRowDetails}
            rowIndex={i}
            onClick={(row, e, rowIndex) => this.props.onRowClick(row, e, data.rows, rowIndex)}
          />
        );

        if (rowData.expanded) {
          rows.push(
            <tr className={expandedRowElement} key={`${rowData.key}--expanded`}>
              <td className={expandedCellElement} colSpan={colCount}>
                {this.props.getRowDetails(rowData.rowConfig)}
              </td>
            </tr>
          );
        }
      }
    }

    const showPagination = data.pageCount > 1 || data.page >= data.pageCount;
    const showHeader = this.props.leftHeader || this.props.rightHeader || showPagination;

    return (
      <div className={joinClassNames(block, this.props.className)}>
        {showHeader
          ? <div className={headerElement}>
              <div className={headerLeftSideElement}>
                {this.props.leftHeader}
              </div>
              <div className={headerRightSideElement}>
                {this.props.rightHeader}
                {showPagination
                  ? <Pagination
                      onPrevPage={this.store.onPrevPage}
                      onNextPage={this.store.onNextPage}
                      currentPage={data.page}
                      pageCount={data.pageCount}
                      ariaLabel="Pagination for previous table"
                      className={paginationElement}
                    />
                  : null}
              </div>
            </div>
          : null}

        {this.props.contentBetweenHeaderAndTable}

        <table className={tableElement}>
          <thead>
            <tr>
              {supportsRowDetails ? <th className={headerToggleCellElement} /> : null}
              {cols.map((col, i) =>
                <th key={i} className={headerCellElement} style={{ width: `${col.width ? col.width + 'px' : ''}` }}>
                  <SortIndicator
                    title={col.title}
                    index={i}
                    sortIndex={data.sortColumnIndex}
                    sortDirection={data.sortDirection}
                    onChangeSort={this.store.setSort}
                    columnDefinition={col}
                  />
                </th>
              )}
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
