/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import {
  CarbonDataTable,
  CarbonTable,
  CarbonTableHead,
  CarbonTableRow,
  CarbonTableHeader,
  CarbonTableBody,
  CarbonTableContainer,
  CarbonTableToolbar,
  CarbonTableToolbarContent,
  CarbonTableToolbarSearch,
  Stack,
  CarbonButton,
  CarbonTableCell
} from '@instana/components';
import { NoDataEmptyState } from '@instana/ibm-products';
import { t } from '@instana/i18n-react';

import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { DashboardTableProps } from 'in-plg/components/DashboardTable/types';

import locals from 'in-plg/components/DashboardTable/DashboardTable.mless';

export const DashboardTable = React.forwardRef<any, DashboardTableProps>(function DashboardTable(
  {
    headers,
    rows,
    isSortable,
    viewLabel,
    hasAddMore,
    hasAddPermission = false,
    viewAll,
    iconColor,
    href,
    addMore,
    addData,
    onSearch,
    sortRow,
    header,
    noDataHeader,
    noDataDescription,
    hasNoDataTile,
    buttonName,
    searchPlaceHolder,
    toggles,
    toggleCallback,
    query,
    ...otherProps
  }: DashboardTableProps,
  ref
) {
  const [filledDefaultValue, setFilledDefaultValue] = useState(false);
  return (
    <CarbonDataTable ref={ref} rows={rows} headers={headers} {...otherProps} sortRow={sortRow} isSortable={isSortable}>
      {({ headers, getTableProps, getHeaderProps, getToolbarProps, getTableContainerProps }: any) => (
        <CarbonTableContainer
          className={classNames({
            [locals.dashboardTable]: header === ''
          })}
          {...getTableContainerProps()}
        >
          {toggles && <Stack gap="disabled">{toggles}</Stack>}
          <CarbonTableToolbar
            aria-label={`${header} ${t('in-plg:welcomepage.ariaLabel.toolbar')}`}
            {...getToolbarProps()}
          >
            <CarbonTableToolbarContent>
              <CarbonTableToolbarSearch
                placeholder={searchPlaceHolder}
                className={locals.plgTableSearchBox}
                size="lg"
                defaultValue={query} // set default value when there is a query in url parameter
                labelText={searchPlaceHolder}
                onChange={(e: '' | React.ChangeEvent<HTMLInputElement>) => {
                  let val = (e as React.ChangeEvent<HTMLInputElement>).target?.value ?? '';
                  // if we have an empty input but we have a previous query, use that query
                  if (val === '' && query && query !== '' && !filledDefaultValue) {
                    val = query;
                  }
                  // Need state variable to differentiate when user removes search param and
                  // when it should be filled in by default
                  setFilledDefaultValue(true);
                  onSearch?.(val);
                }}
                persistent
              />
              {hasAddMore && hasAddPermission && (
                <CarbonButton
                  iconDescription="lib_openclose_add"
                  size="lg"
                  kind="ghost"
                  onClick={addMore}
                  hasIconOnly={false}
                  renderIcon={() => <IconForButton icon="lib_openclose_add" iconSize="s" />}
                  tooltipposition="left"
                  className={locals.addMoreButton}
                >
                  {buttonName}
                </CarbonButton>
              )}
            </CarbonTableToolbarContent>
          </CarbonTableToolbar>
          <CarbonTable aria-label={header} {...getTableProps()}>
            <CarbonTableHead>
              <CarbonTableRow>
                {headers.map(({ header, key }: any) => (
                  <CarbonTableHeader {...getHeaderProps({ header })} key={key}>
                    {header}
                  </CarbonTableHeader>
                ))}
              </CarbonTableRow>
            </CarbonTableHead>
            {hasNoDataTile ? (
              <CarbonTableBody>
                <CarbonTableRow>
                  <CarbonTableCell className={locals.noDataTileCell}>
                    <NoDataEmptyState
                      title={noDataHeader}
                      subtitle={noDataDescription}
                      illustrationPosition="left"
                      className={locals.noDatatile}
                    />
                  </CarbonTableCell>
                </CarbonTableRow>
              </CarbonTableBody>
            ) : (
              <CarbonTableBody>{rows}</CarbonTableBody>
            )}
          </CarbonTable>
        </CarbonTableContainer>
      )}
    </CarbonDataTable>
  );
});
