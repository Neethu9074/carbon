/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ButtonGroup, Pagination as CarbonPagination, DataTable as CarbonDataTable } from '@instana/components';

import SortIndicator from 'in-infrastructure/tableView/components/Table/components/SortIndicator';
import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import { createStore } from 'in-infrastructure/tableView/components/Table/stores/content';
import { carbonPaginationEnabled, carbonTableEnabled } from 'in-services/featureFlags';
import Row from 'in-infrastructure/tableView/components/Table/components/Row';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { shallowEquals } from 'in-services/util/object';
import Pagination from 'in-components/Pagination';
import { t } from 'in-i18n';

import locals from './Table.mless';

const headerElement = locals.header;
const footerElement = locals.footer;
const carbonFooterElement = locals.carbonFooter;
const headerLeftSideElement = locals.headerLeft;
const headerRightSideElement = locals.headerRight;
const tableElement = locals.table;
const cellElement = locals.cell;
const expandedCellElement = `${cellElement} ${locals.expanded}`;
const headerCellElement = locals.headerCell;
const headerToggleCellElement = locals.headerToggleCell;
const columnHeader = locals.columnHeader;

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      selectedData: this.props.selectedRowKeys || [],
      pageSize: this.props.maxItemsPerPage || 10
    };
  }

  componentDidMount() {
    this.newStore(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!shallowEquals(this.props.cols, prevProps.cols) || this.props.maxItemsPerPage !== prevProps.maxItemsPerPage) {
      this.dispose();
      this.newStore(this.props);
    } else {
      if (this.props.rows !== prevProps.rows) {
        this.store.onRowChange(this.props.rows);
      }
      if (!shallowEquals(this.props.selectedRowKeys, prevProps.selectedRowKeys)) {
        this.store.onSelectedRowKeyChange(this.props.selectedRowKeys);
      }
    }
    if (this.props.filter !== prevProps.filter) {
      this.store.setFilter(this.props.filter);
    }

    if (prevState.pageSize !== undefined && prevState.pageSize !== this.state.pageSize) {
      this.dispose();
      this.newStore(this.props);
    }
  }

  newStore(props) {
    this.store = createStore({
      columnDefinitions: props.cols,
      maxItemsPerPage: this.state.pageSize,
      initialSortColumn: props.initialSortColumn || 0,
      initialSortDirection: props.initialSortDirection || 'asc',
      disableSorting: props.disableSorting || false
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
    const selectedData = this.state.selectedData;

    if (!data || !this.store) {
      return null;
    }

    const supportsRowDetails = this.props.getRowDetails != null;
    const toggleRowDetails = supportsRowDetails ? this.store.toggleExpanded : null;
    const colCount = supportsRowDetails ? cols.length + 1 : cols.length;

    const rows = [];
    const carbonHeaders = cols.map((item, i) => ({
      id: i,
      key: item.title,
      header: item.title,
      isSortable: true,
      isSelected: item.isSelected,
      isExpandable: toggleRowDetails,
      sortDirection: data.sortColumnIndex === i ? data.sortDirection.toUpperCase() : 'NONE',
      typeArgs: item.typeArgs,
      type: item.type,
      width: item.width,
      ellipsis: item.ellipsis
    }));
    let carbonRows = [];
    let carbonRow = {};
    let emptyTable = <></>;
    if (!carbonTableEnabled) {
      if (data.rows?.length === 0) {
        rows.push(
          <tr key="no-data">
            <td colSpan={colCount} className={cellElement}>
              {this.props.noDataText || t('in-infrastructure:tableView.noData')}
            </td>
          </tr>
        );
      } else {
        for (let i = 0, length = data.rows?.length; i < length; i++) {
          const rowData = data.rows[i];

          let onClick;
          if (this.props.onRowClick) {
            onClick = (row, e, rowIndex) => this.props.onRowClick(row, e, data.rows, rowIndex);
          }

          const selected = rowData.rowConfig.isSelected;

          rows.push(
            <Row
              key={rowData.key}
              row={rowData}
              cellClassName={cellElement}
              toggleRowDetails={toggleRowDetails}
              rowIndex={i}
              onClick={onClick}
              selected={selected}
            />
          );

          if (rowData.expanded) {
            rows.push(
              <tr key={`${rowData.key}--expanded`}>
                <td className={expandedCellElement} colSpan={colCount}>
                  {this.props.getRowDetails(rowData.rowConfig)}
                </td>
              </tr>
            );
          }
        }
      }
    } else {
      // empty data table
      if (data.rows?.length === 0) {
        emptyTable = (
          <div className={locals.emptyTable}>
            <CarbonDataTable headers={carbonHeaders} rows={[]} />
            <EmptyContent
              cols={cols?.length}
              size="compact"
              renderNoDataAvailable={() => (
                <NoDataAvailable text={this.props.noDataText || t('in-infrastructure:tableView.noData')} height={80} />
              )}
              noDataMessage={this.props.noDataText || t('in-infrastructure:tableView.noData')}
            />
          </div>
        );
      } else {
        // when api returns data
        for (let i = 0, length = data.rows?.length; i < length; i++) {
          carbonRow = {};
          carbonRow['id'] = data.rows[i].key;
          data.rows[i].columns.map((column, i) => {
            // get column header name and assign value to that
            carbonRow[carbonHeaders[i]['header']] = column.content ?? '-';
          });
          carbonRows.push(carbonRow);
        }
      }
    }
    const handleRowSelect = row => {
      const selectedData = this.state.selectedData;
      const isThere = selectedData?.some(i => i === row.id);
      const revisedSelectedData = isThere ? selectedData?.filter(i => i !== row.id) : selectedData?.concat(row.id);
      this.setState({ selectedData: revisedSelectedData });
    };
    const sortRow = sortState => {
      let orderBy = sortState.sortHeaderKey;
      let orderDirection = sortState.sortDirection;
      // backend APIs as of now doesnt support NONE sort direction option, so will be
      // changing it to ASC/DESC to maintain the current behaviour.
      if (sortState.sortDirection === 'NONE') {
        const colType = carbonHeaders.find(x => x.header === sortState.sortHeaderKey).type;
        orderDirection = colType === 'string' ? 'ASC' : 'DESC';
      } else {
        orderDirection = sortState.sortDirection === 'ASC' ? 'DESC' : 'ASC';
      }
      let columnIndex = carbonHeaders.findIndex(x => x.header === orderBy);
      this.store.setSort(columnIndex, orderDirection.toLowerCase());
    };

    const showPagination = data.pageCount > 1 || data.page >= data.pageCount || this.props.alwaysShowPagination;
    const showHeader = this.props.leftHeader || this.props.rightHeader || showPagination;
    return (
      <div className={this.props.className}>
        {showHeader ? (
          <div className={headerElement}>
            <div className={headerLeftSideElement}>{this.props.leftHeader}</div>
            <div className={headerRightSideElement}>
              {this.props.showExpandAll && this.props.getRowDetails && (
                <ButtonGroup
                  buttonPropsList={[
                    {
                      key: 'expand',
                      kind: 'secondary',
                      size: 'compact',
                      onClick: () => this.store.setExpansionStateForAll(true),
                      className: locals.expansionSwitch,
                      text: t('in-infrastructure:tableView.expandAll')
                    },
                    {
                      key: 'collapse',
                      kind: 'secondary',
                      size: 'compact',
                      onClick: () => this.store.setExpansionStateForAll(false),
                      className: locals.expansionSwitch,
                      text: t('in-infrastructure:tableView.collapseAll')
                    }
                  ]}
                />
              )}
              {this.props.rightHeader}

              {showPagination ? (
                <div className={locals.paginationWrapper}>
                  <Pagination
                    onChange={p => this.store.setPage(p - 1)}
                    onNextPage={this.store.onNextPage}
                    currentPage={(data.page || 0) + 1}
                    numPages={data.pageCount}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {this.props.contentBetweenHeaderAndTable}

        {!carbonTableEnabled && (
          <table className={tableElement}>
            <thead className={columnHeader}>
              <tr>
                {supportsRowDetails ? <th className={headerToggleCellElement} /> : null}
                {cols.map((col, i) => (
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
                ))}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        )}
        {/* carbon empty table render */}
        {carbonTableEnabled && data?.rows?.length === 0 && emptyTable}
        {/* carbon with data table render */}
        {carbonTableEnabled && data?.rows?.length !== 0 && (
          <CarbonDataTable
            headers={carbonHeaders}
            rows={carbonRows}
            size={'xs'}
            sortRow={sortState => sortRow(sortState)}
            isSearchEnabled={false}
            isSortable
            isSelectable
            onSelectRow={row => handleRowSelect(row)}
            rowSelected={selectedData}
            onClickingRow={(row, e) => {
              const rowId = data.rows.findIndex(x => x.key === row.id);
              handleRowSelect(row);
              return this.props.onRowClick(data.rows[rowId], e, data.rows, rowId);
            }}
          />
        )}
        {showHeader ? (
          <>
            {showPagination ? (
              <>
                {carbonPaginationEnabled ? (
                  <div className={carbonFooterElement}>
                    <CarbonPagination
                      currentPage={(data.page || 0) + 1}
                      totalItems={this.props.rows?.length}
                      pageSize={this.state.pageSize}
                      pageSizes={[this.props.maxItemsPerPage || 10, this.props.maxItemsPerPage * 2 || 20]}
                      onChange={p => {
                        if (this.state.pageSize !== p.pageSize) {
                          this.setState({ pageSize: p.pageSize });
                        }
                        this.store.setPage(p.page - 1);
                      }}
                    />
                  </div>
                ) : (
                  <div className={footerElement}>
                    <div className={headerRightSideElement}>
                      <div className={locals.paginationWrapper}>
                        <Pagination
                          onChange={p => this.store.setPage(p - 1)}
                          onNextPage={this.store.onNextPage}
                          currentPage={(data.page || 0) + 1}
                          numPages={data.pageCount}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </>
        ) : null}
      </div>
    );
  }
}
