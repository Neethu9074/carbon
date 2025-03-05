/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { createRef } from 'react';

import {
  ButtonGroup,
  Pagination as CarbonPagination,
  CarbonTable,
  CarbonTableBody,
  CarbonTableRow,
  CarbonTableCell,
  CarbonTableHeader,
  CarbonTableHead,
  CarbonTableSelectRow,
  CarbonTableSelectAll,
  CarbonDataTable as DataTable,
  DataTable as CarbonDataTable
} from '@instana/components';

import { clearSelectedSnapshots, toggleSnapshotId } from 'in-infrastructure/tableView/stores/selectedSnapshots';
import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import { createStore } from 'in-infrastructure/tableView/components/Table/stores/content';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { shallowEquals } from 'in-services/util/object';
import { t } from 'in-i18n';

import locals from './Table.mless';

const headerElement = locals.header;
const carbonFooterElement = locals.carbonFooter;
const headerLeftSideElement = locals.headerLeft;
const headerRightSideElement = locals.headerRight;

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.selectAllRef = createRef();
    this.selectedRows = createRef();
    this.state = {
      data: null,
      pageSize: this.props.maxItemsPerPage || 10
    };
  }

  // Expose selectAll function to remove table selection when pressing the button to clear the selections
  selectAll = () => {
    if (this.selectAllRef.current && this.selectedRows.current.length > 0) {
      this.selectAllRef.current();
    }
  };

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

    if (!data || !this.store) {
      return null;
    }

    const supportsRowDetails = this.props.getRowDetails != null;
    const toggleRowDetails = supportsRowDetails ? this.store.toggleExpanded : null;

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
        carbonRow['isSelected'] = data.rows[i].rowConfig.isSelected;
        data.rows[i].columns.map((column, i) => {
          // get column header name and assign value to that
          carbonRow[carbonHeaders[i]['header']] = column.content ?? '-';
        });
        carbonRows.push(carbonRow);
      }
    }

    const sortRow = ({ sortHeaderKey: orderBy, sortDirection }) => {
      const column = carbonHeaders.find(x => x.header === orderBy);

      if (!column) return;

      const { type: colType } = column;
      const isSortDirectionNone = sortDirection === 'NONE';

      const orderDirection = isSortDirectionNone
        ? colType === 'string'
          ? 'ASC'
          : 'DESC'
        : sortDirection === 'ASC'
        ? 'DESC'
        : 'ASC';

      const columnIndex = carbonHeaders.indexOf(column);
      this.store.setSort(columnIndex, orderDirection.toLowerCase());
    };

    const handleSelectRow = (event, row, selectRow, selectedRows) => {
      selectRow(row.id);
      const rowId = data.rows.findIndex(item => item.key === row.id);
      return this.props.onRowClick(data.rows[rowId], event, selectedRows, rowId);
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
            </div>
          </div>
        ) : null}

        {this.props.contentBetweenHeaderAndTable}
        {/* carbon empty table render */}
        {data?.rows?.length === 0 && emptyTable}
        {/* carbon with data table render */}
        {data?.rows?.length !== 0 && (
          <DataTable ref={this.tableRef} rows={carbonRows} headers={carbonHeaders} isSortable isSelectable>
            {({
              rows,
              headers,
              getHeaderProps,
              getRowProps,
              getSelectionProps,
              getTableProps,
              selectRow,
              selectedRows,
              selectAll,
              sortBy
            }) => {
              this.selectedRows.current = selectedRows;
              this.selectAllRef.current = selectAll;
              return (
                <CarbonTable {...getTableProps()}>
                  <CarbonTableHead>
                    <CarbonTableRow>
                      <CarbonTableSelectAll
                        {...getSelectionProps()}
                        onSelect={e => {
                          clearSelectedSnapshots();
                          if (e.target.checked) {
                            data.rows.forEach(row =>
                              toggleSnapshotId(row.key, row.snapshot ? row.snapshot.get('plugin') : null)
                            );
                          }
                          selectAll();
                        }}
                      />
                      {headers.map((header, i) => (
                        <CarbonTableHeader
                          key={header.id}
                          {...getHeaderProps({
                            header
                          })}
                          isSortable
                          isSortHeader={data.sortColumnIndex === i}
                          sortDirection={header.sortDirection}
                          onClick={() => {
                            sortBy(header.key);
                            sortRow({
                              sortHeaderKey: header.key,
                              sortDirection: header.sortDirection
                            });
                          }}
                        >
                          {header.header}
                        </CarbonTableHeader>
                      ))}
                    </CarbonTableRow>
                  </CarbonTableHead>
                  <CarbonTableBody>
                    {rows.map((row, i) => (
                      <CarbonTableRow
                        key={i}
                        {...getRowProps({ row })}
                        onClick={evt => handleSelectRow(evt, row, selectRow, selectedRows)}
                      >
                        <CarbonTableSelectRow
                          {...getSelectionProps({ row })}
                          checked={this.props.rows.find(item => item.snapshotId === row.id)?.isSelected}
                          onSelect={evt => {
                            evt.stopPropagation();
                            handleSelectRow(evt, row, selectRow, selectedRows);
                          }}
                        />
                        {row.cells.map(cell => (
                          <CarbonTableCell key={cell.id}>
                            <span onClick={evt => evt.stopPropagation()}>{cell.value}</span>
                          </CarbonTableCell>
                        ))}
                      </CarbonTableRow>
                    ))}
                  </CarbonTableBody>
                </CarbonTable>
              );
            }}
          </DataTable>
        )}
        {showHeader ? (
          <>
            {showPagination ? (
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
            ) : null}
          </>
        ) : null}
      </div>
    );
  }
}
