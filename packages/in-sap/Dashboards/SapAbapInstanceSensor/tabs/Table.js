/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Card, DataTable as CarbonDataTable } from '@instana/components';
import { ButtonGroup } from '@instana/components';
import { Pagination } from '@instana/components';

import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import { createStore } from 'in-sdk/components/dashboard/Table/stores/content';
import Row from 'in-sdk/components/dashboard/Table/components/Row';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { shallowEquals } from 'in-services/util/object';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table.mless';

const cellElement = locals.cell;
const expandedCellElement = `${cellElement} ${locals.expanded}`;

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

  componentDidUpdate(prevProps) {
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
  }

  newStore(props) {
    this.store = createStore({
      columnDefinitions: props.cols,
      maxItemsPerPage: props.maxItemsPerPage || 10,
      initialSortColumn: props.initialSortColumn || 0,
      initialSortDirection: props.initialSortDirection || 'asc',
      disableSorting: props.disableSorting || false
    });
    this.store.onRowChange(props.rows);
    this.store.onSelectedRowKeyChange(props.selectedRowKeys);
    this.dataSubscription = this.store.sortedPagedData$.subscribe(data => this.setState({ data }));
    this.filterSubscription = this.store.filter$.subscribe(filter => this.setState({ filter }));
  }

  dispose() {
    if (this.dataSubscription) {
      this.dataSubscription.dispose();
    }
    if (this.filterSubscription) {
      this.filterSubscription.dispose();
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
      let title = `${t('in-sap:dashboards.no')}${t('in-sap:dashboards.dataAvailable')}`;
      if (typeof this.props.cardTitle === 'string') {
        title = `${t('in-sap:dashboards.no')}${this.props.cardTitle}${t('in-sap:dashboards.dataAvailable')}`;
      } else {
        title = `${t('in-sap:dashboards.no')}${this.props.cardTitle.props['title']}${t(
          'in-sap:dashboards.dataAvailable'
        )}`;
      }
      rows.push(
        <tr key="no-data">
          <td colSpan={colCount} className={cellElement}>
            <NoDataAvailable text={title} />
          </td>
        </tr>
      );
    } else {
      for (let i = 0, length = data.rows.length; i < length; i++) {
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

    const showPagination = data.pageCount > 1 || data.page >= data.pageCount || this.props.alwaysShowPagination;

    const header = (
      <div className={locals.headerExtensions}>
        {this.props.rightHeader}

        {this.props.showExpandAll && this.props.getRowDetails && (
          <ButtonGroup
            buttonPropsList={[
              {
                key: 'expand',
                kind: 'secondary',
                size: 'compact',
                onClick: () => this.store.setExpansionStateForAll(true),
                className: locals.expansionSwitch,
                text: t('in-sdk:dashboard.table.tableExpandAll')
              },
              {
                key: 'collapse',
                kind: 'secondary',
                size: 'compact',
                onClick: () => this.store.setExpansionStateForAll(false),
                className: locals.expansionSwitch,
                text: t('in-sdk:dashboard.table.tableCollapseAll')
              }
            ]}
          />
        )}
      </div>
    );

    const carbonHeaders = cols.map((item, i) => ({
      id: i,
      key: item.title,
      header: item.title,
      isSortable: true,
      sortDirection: data.sortColumnIndex === i ? data.sortDirection.toUpperCase() : 'NONE'
    }));
    let carbonRows = [];
    let carbonRow = {};
    let title = `${t('in-sap:dashboards.no')}${t('in-sap:dashboards.dataAvailable')}`;

    if (data.rows.length === 0) {
      if (typeof this.props.cardTitle === 'string') {
        title = `${t('in-sap:dashboards.no')}${this.props.cardTitle}${t('in-sap:dashboards.dataAvailable')}`;
      } else {
        title = `${t('in-sap:dashboards.no')}${this.props.cardTitle.props['title']}${t(
          'in-sap:dashboards.dataAvailable'
        )}`;
      }
    } else {
      for (let i = 0, length = data.rows.length; i < length; i++) {
        carbonRow = {};
        carbonRow['id'] = data.rows[i].key || String(i);
        data.rows[i].columns.map((column, i) => {
          // get column header name and assign value to that
          carbonRow[carbonHeaders[i]['header']] = column.content ?? '-';
        });
        if (this.props.getRowDetails != undefined) {
          carbonRow['expanded'] = this.props.getRowDetails(data.rows[i].rowConfig);
        }
        carbonRows.push(carbonRow);
      }
    }
    return (
      <div className={locals.tableContainer}>
        <Card
          title={this.props.cardTitle === '' ? null : this.props.cardTitle}
          header={this.props.cardTitle === '' ? null : header}
          withoutPadding={this.props.cardTitle === '' ? null : this.props.withoutPadding}
        >
          <CarbonDataTable
            headers={carbonHeaders}
            rows={carbonRows}
            filterRows={value => {
              this.setState({ filter: value?.target?.value });
              this.store.setFilter(value?.target?.value);
            }}
            sortRow={sortState => {
              let orderBy = sortState.sortHeaderKey;
              let orderDirection = sortState.sortDirection;
              // backend APIs as of now doesnt support NONE sort direction option, so will be
              // changing it to ASC to maintain the current behaviour.
              if (sortState.sortDirection === 'NONE' || sortState.sortDirection === 'DESC') {
                orderDirection = 'ASC';
              } else if (sortState.sortDirection === 'ASC') {
                orderDirection = 'DESC';
              }
              let columnIndex = carbonHeaders.findIndex(x => x.header === orderBy);

              this.store.setSort(columnIndex, orderDirection.toLowerCase());
            }}
            searchText={this.state.filter}
            isSearchEnabled
            isExpandable={this.props.getRowDetails !== undefined ? true : false}
          />
          {showPagination ? (
            <Pagination
              currentPage={(data.page || 0) + 1}
              totalItems={this.props.rows?.length}
              pageSize={this.store.maxItemsPerPage ?? 10}
              pageSizes={[this.store.maxItemsPerPage ?? 10]}
              onChange={p => this.store.setPage(p.page - 1)}
            />
          ) : null}
          {data.rows.length === 0 && (
            <div className={locals.emptyTable}>
              <EmptyContent
                cols={cols?.length}
                size="compact"
                renderNoDataAvailable={() => <NoDataAvailable text={title} height={80} />}
                noDataMessage={title}
              />
            </div>
          )}
        </Card>
      </div>
    );
  }
}
