/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import AuditLogDownloadView from 'in-settings/tabs/SecurityAndAccess/components/AuditLogDownloadView';
import { fromNow, formatDateTime } from 'in-services/formatters/date';
import { getAccessLog, getAccessLogEndpoint } from 'in-api/auditLog';
import { success, loading } from 'in-services/util/result';
import ServerTable from 'in-components/tables/ServerTable';
import { t } from 'in-i18n';

const PAGE_SIZE = 20;

function calcOffset(page, pageSize) {
  return (page - 1) * pageSize;
}

export default function AccessLog() {
  const columnDefinitions = [
    {
      id: 'name',
      label: t('in-settings:tabs.actorName'),
      sortable: false,
      useMinimumAmountOfHorizontalSpace: true,
      getContent(logEntry) {
        return <KeyValue label={logEntry.email} value={logEntry.fullName} accentuated inverted />;
      }
    },
    {
      id: 'action',
      label: t('in-settings:tabs.actorAction'),
      sortable: false,
      useMinimumAmountOfHorizontalSpace: true,
      getContent(logEntry) {
        return <span> {logEntry.action}</span>;
      }
    },
    {
      id: 'timestamp',
      label: t('in-settings:tabs.actionTimestamp'),
      sortable: false,
      useMinimumAmountOfHorizontalSpace: true,
      getContent(logEntry) {
        return <span>{`${fromNow(logEntry.timestamp)} (${formatDateTime(logEntry.timestamp)})`}</span>;
      }
    }
  ];

  const endpoint = getAccessLogEndpoint();

  return (
    <ServerTable
      get={({ query, page, pageSize }) =>
        getAccessLog(calcOffset(page, pageSize), query, pageSize).map(({ entries, total }) =>
          entries
            ? success(
                {
                  items: entries,
                  totalHits: total,
                  pageSize
                },
                Date.now()
              )
            : loading
        )
      }
      getResettingProps={() => ['query']}
      defaultPageSize={PAGE_SIZE}
      defaultPageSizes={[10, 20, 50, 100, 500, 1000]}
      columnDefinitions={columnDefinitions}
      rightHeader={({ query, page, pageSize }) => (
        <AuditLogDownloadView
          offset={calcOffset(page, pageSize)}
          pageSize={pageSize}
          query={query}
          endpoint={endpoint}
          download
        />
      )}
      getRowProps={() => ({ size: 'compact' })}
    />
  );
}
