/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import AuditLogDownloadView from 'in-components/DownloadButton/components/AuditLogDownloadView';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { fromNow, formatDateTime } from 'in-services/formatters/date';
import { success, loading } from 'in-services/util/result';
import ServerTable from 'in-components/tables/ServerTable';
import { toHtml } from 'in-services/formatters/markdown';
import { getAuditLog } from 'in-api/auditLog';
import Gravatar from 'in-components/Gravatar';
import Title from 'in-components/Title/Title';
import { t } from 'in-i18n';

import locals from './AuditLog.mless';

const PAGE_SIZE = 15;

export default function AuditLog() {
  return (
    <>
      <Title title={t('in-settings:tabs.auditLog')} />
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
          <AuditLogDownloadView offset={calcOffset(page, pageSize)} query={query} />
        )}
        getRowProps={() => ({ size: 'compact' })}
      />
    </>
  );
}

const columnDefinitions = [
  {
    id: 'gravatar',
    label: t('in-settings:tabs.user'),
    sortable: false,
    cellClassName: locals.avatar,
    useMinimumAmountOfHorizontalSpace: true,
    getContent(logEntry) {
      if (!logEntry.actor || logEntry.actor.type !== 'USER' || !logEntry.actor.email) {
        return t('in-settings:tabs.apiCall');
      }
      return <Gravatar email={logEntry.actor.email} size="l" />;
    }
  },
  {
    id: 'logEntry',
    label: t('in-settings:tabs.logEntry'),
    sortable: false,
    getContent(logEntry) {
      return (
        <div className={locals.text}>
          {logEntry.actor && logEntry.actor.name && <span className={locals.fullName}>{logEntry.actor.name}</span>}
          <span className={locals.topic}> - {logEntry.action}</span>
          <span className={locals.time}>
            {` - ${fromNow(logEntry.timestamp)} (${formatDateTime(logEntry.timestamp)})`}
          </span>

          <DangerousHtmlPresenter className={locals.markdown} html={toHtml(logEntry.message)} />
        </div>
      );
    }
  }
];

function calcOffset(page, pageSize) {
  return (page - 1) * pageSize;
}
