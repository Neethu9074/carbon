/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { DataTable, Layer, Link, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@instana/carbon';
import { generateUniqueShortId } from '@instana/utils';
import { SidePanel } from '@instana/ibm-products';

import { getContentBySeverity } from 'in-synthetics/dashboards/global/tabs/tests/components/LocationsPresenter';
import { JsxRow, LocationsSidePanelProps } from 'in-synthetics/utils/constants';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions.mless';

export function LocationsSidePanel({
  locationsColumnText,
  locationsSidePanelOpen,
  locationStatusList,
  setLocationsSidePanelOpen
}: LocationsSidePanelProps) {
  const headers = [
    { key: 'name', header: t('in-synthetics:dashboard.testList.locationsColumn.locationsNameHeader') },
    { key: 'health', header: t('in-synthetics:dashboard.testList.locationsColumn.locationsHealthHeader') }
  ];

  let rows: JsxRow[] = [];
  locationStatusList.forEach(location =>
    rows.push({
      id: generateUniqueShortId(),
      name: location.locationDisplayLabel ?? '',
      health: getContentBySeverity(location)
    })
  );

  if (locationStatusList.length !== 0) {
    return (
      <>
        <SidePanel
          open={locationsSidePanelOpen}
          size="md"
          includeOverlay
          onRequestClose={() => setLocationsSidePanelOpen(false)}
          title={t('in-synthetics:dashboard.testList.locationsColumn.locationsSidePanelTitle', {
            totalLocations: locationStatusList.length
          })}
          animateTitle={false}
        >
          <Layer>
            <DataTable rows={rows} headers={headers}>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </Layer>
        </SidePanel>

        <Link onClick={() => setLocationsSidePanelOpen(true)}>
          <span data-test="locations-col-text" className={locals.labelApp}>
            {locationsColumnText}
          </span>
        </Link>
      </>
    );
  }
  return <span data-test="no-locations-span">{''}</span>;
}
