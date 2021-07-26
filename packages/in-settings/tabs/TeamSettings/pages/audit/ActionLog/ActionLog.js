/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import AuditLogDownloadView from 'in-settings/tabs/TeamSettings/components/AuditLogDownloadView';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { fromNow, formatDateTime } from 'in-services/formatters/date';
import { getAuditLog, getAuditLogEndpoint } from 'in-api/auditLog';
import { success, loading } from 'in-services/util/result';
import ServerTable from 'in-components/tables/ServerTable';
import { toHtml } from 'in-services/formatters/markdown';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import audit from '../Audit.mless';

const PAGE_SIZE = 15;

function calcOffset(page, pageSize) {
  return (page - 1) * pageSize;
}

/**
 * Previously named as AuditLog
 */
export default function ActionLog() {
  const columnDefinitions = [
    {
      id: 'actor',
      label: t('in-settings:tabs.actor'),
      useMinimumAmountOfHorizontalSpace: true,
      sortable: false,
      getContent(logEntry) {
        let type = t('in-settings:tabs.userCall');
        if (logEntry.actor.type !== 'USER' || !logEntry.actor.email) {
          type = t('in-settings:tabs.apiCall');
        }
        return <span>{type}</span>;
      }
    },
    {
      id: 'name',
      label: t('in-settings:tabs.actorName'),
      sortable: false,
      useMinimumAmountOfHorizontalSpace: true,
      getContent(logEntry) {
        return <KeyValue label={logEntry.actor.email ?? ''} value={logEntry.actor.name} accentuated inverted />;
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
      id: 'description',
      label: t('in-settings:tabs.actionDescription'),
      sortable: false,
      useMinimumAmountOfHorizontalSpace: true,
      getContent(logEntry) {
        return <DangerousHtmlPresenter className={audit.markdown} html={toHtml(logEntry.message)} />;
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

  const endpoint = getAuditLogEndpoint();

  return (
    <>
      <Title title={t('in-settings:tabs.actionLog')} />
      <ServerTable
        get={({ query, page, pageSize }) =>
          getAuditLog(calcOffset(page, pageSize), query, pageSize).map(({ entries, total }) =>
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
        columnDefinitions={columnDefinitions}
        paginationResettingProps={{}}
        rightHeader={({ query, page, pageSize }) => (
          <AuditLogDownloadView
            offset={calcOffset(page, pageSize)}
            pageSize={pageSize}
            query={query}
            endpoint={endpoint}
          />
        )}
        getRowProps={() => ({ size: 'compact' })}
      />
    </>
  );
}
