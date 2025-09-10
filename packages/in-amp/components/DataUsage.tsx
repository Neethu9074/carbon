/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';

import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableContainer,
  DataTableSkeleton,
  TableToolbarSearch,
  TableToolbar,
  TableToolbarContent
} from '@instana/carbon';
import { Observable } from '@instana/observables';
import { Typography } from '@instana/components';
import { useObservable } from '@instana/hooks';

//@ts-expect-error
import WithAccountInformation from 'in-amp/components/WithAccountInformation';
//@ts-expect-error
import AmpInformationModifier from 'in-amp/components/AmpInformationModifier';
//@ts-expect-error
import useAmpUrlInformation from 'in-amp/hooks/useAmpUrlInformation';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http/http';
import { t } from 'in-i18n';

interface ServiceData {
  key: {
    label: string;
    id: string;
  };
  value: string;
}

interface ServiceVolumeResponse {
  metadata: {
    columns: Array<{
      dataKey: string;
      name: string;
      type: string;
      properties: any;
    }>;
  };
  data: ServiceData[];
}

interface TenantUnit {
  tenant: string;
  unit: string;
}

interface TenantOption {
  value: TenantUnit;
}

interface DataGranularityTableProps {
  unitSelectorOptions: TenantOption[];
  getCurrentTenantOption: (options: TenantOption[]) => TenantOption | undefined;
}

const getDataGranularityObservable = memoize(
  getDataGranularityObservableInternal,
  ([to, windowSize]) => `${to}_${windowSize}`,
  60000
);

function getDataGranularityObservableInternal([fupTo, fupWindowSize]: [
  number,
  number
]): Observable<ServiceVolumeResponse> {
  const url = `/api/amp/usage/trace?windowSize=${fupWindowSize}&to=${fupTo}`;

  return http({
    method: 'GET',
    maxRetries: 3,
    url
  }).map(response => {
    return response.body as ServiceVolumeResponse;
  });
}

export default function DataUsage() {
  return (
    <WithAccountInformation>
      {(props: DataGranularityTableProps) => <DataGranularityReporting {...props} />}
    </WithAccountInformation>
  );
}

function DataGranularityReporting({ unitSelectorOptions, getCurrentTenantOption }: DataGranularityTableProps) {
  const { fupWindowSize, setFupWindowSize, tenantUnit, fupTimeRange, setFupTimeRange, setTenantUnit, fupTo, fupSetTo } =
    useAmpUrlInformation(getCurrentTenantOption(unitSelectorOptions)?.value);

  const data = useObservable(() => getDataGranularityObservable([fupTo, fupWindowSize]), [fupTo, fupWindowSize]);

  const dataTableRows = (data?.data ?? []).map((item, index) => ({
    id: `row-${index}`,
    name: item.key?.label ?? '',
    value: item.value ?? ''
  }));

  const headers = [
    {
      key: 'name',
      header: t('in-amp:fairUsePolicy.serviceName')
    },
    {
      key: 'value',
      header: t('in-amp:fairUsePolicy.precentageUsage')
    }
  ];

  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRows = useMemo(() => {
    if (!searchQuery) return dataTableRows;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return dataTableRows.filter(
      row => row.name.toLowerCase().includes(lowerCaseQuery) || row.value.toLowerCase().includes(lowerCaseQuery)
    );
  }, [dataTableRows, searchQuery]);

  const handleSearch = useCallback((e: string | ChangeEvent<HTMLInputElement>) => {
    const value = typeof e === 'string' ? e : e.target.value;
    setSearchQuery(value);
  }, []);

  if (!data) {
    return (
      <TableContainer
        title={
          <>
            <Typography variant="heading-03" noMargin>
              {t('in-amp:fairUsePolicy.tableHeading')}
            </Typography>
            <Typography variant="body-compact-01" noMargin>
              {t('in-amp:fairUsePolicy.tableDefinition')}
            </Typography>
          </>
        }
      >
        <DataTableSkeleton headers={headers} rowCount={4} columnCount={2} compact />
      </TableContainer>
    );
  }
  return (
    <>
      <AmpInformationModifier
        unitSelectorOptions={unitSelectorOptions}
        tenantUnit={tenantUnit}
        setTenantUnit={setTenantUnit}
        fupTimeRange={fupTimeRange}
        setFupTimeRange={setFupTimeRange}
        fupWindowSize={fupWindowSize}
        setFupWindowSize={setFupWindowSize}
        fupTo={fupTo}
        fupSetTo={fupSetTo}
        isFup
      />

      <DataTable rows={filteredRows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer
            title={
              <>
                <Typography variant="heading-03" noMargin>
                  {t('in-amp:fairUsePolicy.tableHeading')}
                </Typography>
                <Typography variant="body-compact-01" noMargin>
                  {t('in-amp:fairUsePolicy.tableDefinition')}
                </Typography>
              </>
            }
          >
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  persistent
                  onChange={handleSearch}
                  placeholder={t('in-amp:fairUsePolicy.tableSearchText')}
                />
              </TableToolbarContent>
            </TableToolbar>
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
          </TableContainer>
        )}
      </DataTable>
    </>
  );
}
