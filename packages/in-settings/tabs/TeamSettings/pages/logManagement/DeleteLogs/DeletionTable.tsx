/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import {
  LoadingSkeleton,
  SvgIcon,
  Table,
  TableLoadingSkeletonRows,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography
} from '@instana/components';

import { TableStates } from 'in-settings/tabs/TeamSettings/pages/logManagement/DeleteLogs/types';
import { siPrefixCompact } from 'in-stores/metric/formatters';
import { t } from 'in-i18n';

import locals from './DeletionTable.mless';

const mockData = [
  {
    timestamp: '28.05.2023',
    reason: 'PII Leak, found by devs ticket UFH2345D_xy',
    numberOfLogs: null,
    triggeredBy: 'Amalia Rodriguez',
    status: 'inProgress'
  },
  {
    timestamp: '29.05.2023',
    reason: 'PII Leak, found by devs ticket UFH2345D_xy',
    numberOfLogs: 100000,
    triggeredBy: 'Amalia Rodriguez',
    status: 'success'
  },
  {
    timestamp: '30.05.2023',
    reason: 'PII Leak, found by devs ticket UFH2345D_xy',
    numberOfLogs: 0,
    triggeredBy: 'Amalia Rodriguez',
    status: 'failure'
  }
];
export const DeletionTable = () => {
  const localisationStrings = {
    deleteLogs: t('in-settings:tabs.deleteLogs.deleteLogs'),
    timestamp: t('in-settings:tabs.deleteLogs.timestamp'),
    reason: t('in-settings:tabs.deleteLogs.reason'),
    numberOfLogs: t('in-settings:tabs.deleteLogs.numberOfLogs'),
    triggered: t('in-settings:tabs.deleteLogs.triggered'),
    status: t('in-settings:tabs.deleteLogs.status'),
    noData: t('in-settings:tabs.deleteLogs.noData'),
    noDataInfo: t('in-settings:tabs.deleteLogs.noDataInfo'),
    summary: t('in-settings:tabs.deleteLogs.summary'),
    wrong: t('in-settings:tabs.deleteLogs.wrong'),
    errorInfo: t('in-settings:tabs.deleteLogs.errorInfo'),
    errorId: t('in-settings:tabs.deleteLogs.errorId', { errorId: '123456789' }),
    success: t('in-settings:tabs.deleteLogs.success'),
    failed: t('in-settings:tabs.deleteLogs.failed'),
    inProgress: t('in-settings:tabs.deleteLogs.inProgress')
  };

  const [state] = useState<TableStates>('idle');

  const getDataRows = () => {
    return mockData.map(item => (
      <Tr>
        <Td>{item.timestamp}</Td>
        <Td>{item.reason}</Td>
        <Td>
          {item.numberOfLogs !== null ? (
            siPrefixCompact.formatter(item.numberOfLogs)
          ) : (
            <LoadingSkeleton className={locals.skeleton} />
          )}
        </Td>
        <Td>{item.triggeredBy}</Td>
        <Td>
          {
            {
              failure: (
                <div className={locals.status}>
                  <SvgIcon color="#FF4040" type="lib_help_error_warning_outline" size="regular" />
                  <Typography variant="body-bold">{localisationStrings.failed}</Typography>
                </div>
              ),
              success: (
                <div className={locals.status}>
                  <SvgIcon color="#39BF7C" type="lib_check" size="regular" />
                  <Typography variant="body-bold">{localisationStrings.success}</Typography>
                </div>
              ),
              inProgress: (
                <div className={locals.status}>
                  <SvgIcon color="#17A1E6" spinning type="lib_actions_loading" size="regular" />
                  <Typography variant="body-bold">{localisationStrings.inProgress}</Typography>
                </div>
              )
            }[item.status]
          }
        </Td>
      </Tr>
    ));
  };

  return (
    <section className={locals.tableSection}>
      <Typography variant={'heading-200'}>{localisationStrings.summary}</Typography>
      <Table style={{ borderCollapse: 'collapse' }} fixedLayout className={locals.deletionTable}>
        <Thead>
          <Tr size="regular">
            <Th>{localisationStrings.timestamp}</Th>
            <Th>{localisationStrings.reason}</Th>
            <Th>{localisationStrings.numberOfLogs}</Th>
            <Th>{localisationStrings.triggered}</Th>
            <Th>{localisationStrings.status}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            {
              loading: <TableLoadingSkeletonRows cols={5} rows={3} />,
              empty: (
                <Tr>
                  <td colSpan={5}>
                    <section className={locals.stateContainer}>
                      <div className={locals.emptyState}>
                        <SvgIcon type={'lib_help_error_info_outline'} size="xxxl" />
                        <Typography variant={'body-bold'}>{localisationStrings.noData}</Typography>
                        <Typography variant={'body-regular'}>{localisationStrings.noDataInfo}</Typography>
                      </div>
                    </section>
                  </td>
                </Tr>
              ),
              error: (
                <Tr>
                  <td colSpan={5}>
                    <section className={locals.stateContainer}>
                      <div className={locals.emptyState}>
                        <SvgIcon type={'lib_help_error_error_circle'} size="xxxl" />
                        <Typography variant={'body-bold'}>{localisationStrings.wrong}</Typography>
                        <Typography variant={'body-regular'}>{localisationStrings.errorInfo}</Typography>
                        <Typography variant={'body-regular'}>{localisationStrings.errorId}</Typography>
                      </div>
                    </section>
                  </td>
                </Tr>
              ),
              idle: getDataRows()
            }[state]
          }
        </Tbody>
      </Table>
    </section>
  );
};
