/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ButtonGroup, Pagination as CarbonPagination, DataTable as CarbonDataTable, Card } from '@instana/components';

import EmptyContent from 'in-components/tables/ServerTable/internalComponents/EmptyContent';
import { createStore } from 'in-sdk/components/dashboard/Table/stores/content';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { shallowEquals } from 'in-services/util/object';
import { t } from 'in-i18n';

import locals from './Table.mless';

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
    const CSVExportButton = this.props.CSVExportButton;
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

    if (data.rows.length === 0) {
      return (
        <div className={locals.tableContainer}>
          <Card title={this.props.cardTitle} header={header} withoutPadding={this.props.withoutPadding}>
            {this.props.explanation}
            <div className={locals.emptyTable}>
              <CarbonDataTable
                headers={carbonHeaders}
                rows={[]}
                filterRows={value => {
                  this.setState({ filter: value?.target?.value });
                  this.store.setFilter(value?.target?.value);
                }}
                searchText={this.state.filter}
              />
              <EmptyContent
                cols={cols?.length}
                size="compact"
                renderNoDataAvailable={() => (
                  <NoDataAvailable text={t('in-sdk:dashboard.table.tableNoData')} height={80} />
                )}
                noDataMessage={t('in-sdk:dashboard.table.tableNoData')}
              />
            </div>
          </Card>
        </div>
      );
    }

    const carbonRows = data.rows.map((row, i) => {
      const carbonRow = {
        id: row.key ?? String(i)
      };
      row.columns.map((column, i) => {
        // get column header name and assign value to that
        carbonRow[carbonHeaders[i].header] = column.content ?? '-';
      });
      // optionally, make rows expandable
      if (this.props.getRowDetails) {
        carbonRow.isExpanded = row?.expanded;
        carbonRow.expanded = this.props.getRowDetails(row.rowConfig, this.props.distanceBetweenDatapointsInMillis);
      }
      return carbonRow;
    });

    return (
      <div className={locals.tableContainer}>
        <Card
          title={this.props.cardTitle}
          header={header}
          withoutPadding={this.props.withoutPadding}
          // rightHeaderContent renders the optional CSVExportButton
          rightHeaderContent={CSVExportButton && <CSVExportButton csvHeaders={carbonHeaders} csvData={carbonRows} />}
        >
          {this.props.explanation}
          <CarbonDataTable
            headers={carbonHeaders}
            rows={carbonRows}
            filterRows={value => {
              this.setState({ filter: value?.target?.value });
              this.store.setFilter(value?.target?.value);
            }}
            sortRow={sortState => {
              const orderBy = sortState.sortHeaderKey;
              let orderDirection = sortState.sortDirection;
              // backend APIs as of now doesnt support NONE sort direction option, so will be
              // changing it to ASC to maintain the current behaviour.
              if (sortState.sortDirection === 'NONE' || sortState.sortDirection === 'DESC') {
                orderDirection = 'ASC';
              } else if (sortState.sortDirection === 'ASC') {
                orderDirection = 'DESC';
              }
              const columnIndex = carbonHeaders.findIndex(x => x.header === orderBy);

              this.store.setSort(columnIndex, orderDirection.toLowerCase());
            }}
            searchText={this.state.filter}
            isExpandable={this.props.getRowDetails}
            onClickExpandRow={toggleRowDetails}
            isSearchEnabled
          />
          {showPagination && (
            <CarbonPagination
              currentPage={(data.page ?? 0) + 1}
              totalItems={data.totalFilteredRowCount ?? this.props.rows?.length}
              pageSize={this.props.maxItemsPerPage ?? 10}
              pageSizes={[this.props.maxItemsPerPage ?? 10]}
              onChange={p => this.store.setPage(p.page - 1)}
            />
          )}
          {this.props.bottomContent && <div className={locals.bottomContent}>{this.props.bottomContent}</div>}
        </Card>
      </div>
    );
  }
}
