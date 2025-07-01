/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React, { useMemo } from 'react';

import { DataTable, Modal, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@instana/carbon';

import { RawDataForModalTable, normalizeMapDataForModalTable } from 'in-components/GeoHeatMap/utils';
import { t } from 'in-i18n';

interface GeoHeatMapTableViewModalProps {
  modalOpen: boolean;
  onRequestClose: () => void;
  rawData: RawDataForModalTable;
}

const tableHeaders = [
  {
    key: 'title',
    header: t('in-components:general.region')
  },
  {
    key: 'value',
    header: t('in-components:geoHeatMap.pageLoads')
  }
];

export const GeoHeatMapTableViewModal = ({ modalOpen, rawData, onRequestClose }: GeoHeatMapTableViewModalProps) => {
  const normalizedData = useMemo(() => normalizeMapDataForModalTable(rawData), [rawData]);

  return (
    <Modal
      modalHeading={t('in-components:geoHeatMap.pageLoads')}
      modalLabel={t('in-components:chart.charTable.tabularRep')}
      aria-label={t('in-components:geoHeatMap.modalContent')}
      passiveModal
      open={modalOpen}
      onRequestClose={onRequestClose}
    >
      <DataTable rows={normalizedData} headers={tableHeaders}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => {
          return (
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
                    {row.cells.map(cell => {
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          );
        }}
      </DataTable>
    </Modal>
  );
};
