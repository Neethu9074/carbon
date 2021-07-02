/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import SortIndicator from 'in-sdk/components/dashboard/Table/components/SortIndicator';
import { createStore } from 'in-sdk/components/dashboard/Table/stores/content';
import Row from 'in-sdk/components/dashboard/Table/components/Row';
import { shallowEquals } from 'in-services/util/object';
import ButtonGroup from 'in-components/ButtonGroup';
import SearchInput from 'in-components/SearchInput';
import Pagination from 'in-components/Pagination';
import { t } from 'in-i18n';

import locals from './Table.mless';

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
      rows.push(
        <tr key="no-data">
          <td colSpan={colCount} className={cellElement}>
            {this.props.noDataText || t('in-sdk:dashboard.table.tableNoData')}
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
        <SearchInput maxWidth={140} query={this.state.filter} onChange={this.store.setFilter} />
      </div>
    );

    return (
      <div className={locals.tableContainer}>
        <Card title={this.props.cardTitle} header={header} withoutPadding={this.props.withoutPadding}>
          {this.props.explanation}
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
          {showPagination ? (
            <div className={locals.paginationWrapper}>
              <Pagination
                onChange={newPage => this.store.setPage(newPage - 1)}
                currentPage={(data.page || 0) + 1}
                numPages={data.pageCount}
              />
            </div>
          ) : null}

          {this.props.bottomContent ? <div className={locals.bottomContent}>{this.props.bottomContent}</div> : null}
        </Card>
      </div>
    );
  }
}
