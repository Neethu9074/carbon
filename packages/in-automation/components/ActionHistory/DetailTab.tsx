/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DateFormatterInput } from '@instana/format-date';
import { Link } from '@instana/legacy';

import { getStatus } from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { actionCatalogPath } from 'in-automation/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { getEntityIdView } from 'in-settings/navigation/paths';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import { eventsPath } from 'in-events/navigation/paths';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './actionInstanceDetail.mless';

interface ActionInstanceProperty {
  actionInstanceId: string;
  actionName: string;
  eventId: string;
  returnCode: number;
  problemText: string;
  status: string;
  errorMessage?: string;
  hostSnapshotId: string;
  actionId: string;
  startDate: DateFormatterInput;
  endDate: DateFormatterInput;
  targetsnapshotid?: string;
}
export default function DetailTab({ id, properties }: { id: string; properties: ActionInstanceProperty }) {
  const { createHref, location } = useNavigation();
  function getLinkToEventDetails(id: string) {
    const path = location;
    path.pathname = eventsPath;
    setOrDeleteMatrixKey(path, eventsPath, 'view', 'issue');
    setOrDeleteMatrixKey(path, eventsPath, 'eventId', id);
    return createHref(path);
  }

  const {
    actionName,
    eventId,
    returnCode,
    problemText,
    status,
    errorMessage,
    hostSnapshotId,
    actionId,
    startDate,
    targetsnapshotid,
    endDate
  } = properties;

  const timeConfig = useTimeConfig();

  const tagFilterExpression = tagFilter('log.custom', 'EQUALS', id, 'actionInstanceId');
  const link = getLinkToAnalyze({ tagFilterExpression: [tagFilterExpression], timeConfig });

  const tableData = [
    { label: t('in-automation:actionHistory.actionInstanceId'), value: id },
    { label: t('in-automation:actionHistory.eventName'), value: problemText },
    {
      label: t('in-automation:actionHistory.eventId'),
      value: eventId,
      isLink: true,
      stringLink: getLinkToEventDetails(eventId)
    },
    { label: t('in-automation:actionHistory.returnCode'), value: returnCode },
    { label: t('in-automation:actionHistory.startTime'), value: formatDateTime(startDate) },
    {
      label: t('in-automation:actionHistory.endTime'),
      value: endDate ? formatDateTime(endDate) : formatDateTime(null)
    },
    { label: t('in-automation:actionHistory.status'), value: getStatus(status) },
    {
      label: t('in-automation:actionHistory.actionContent'),
      value: actionName,
      isLink: true,
      isObservable: true,
      ObservableLink: getEntityIdView(actionCatalogPath, actionId)
    },
    {
      label: t('in-automation:actionHistory.hostSnapshotId'),
      value: hostSnapshotId,
      isLink: true,
      isObservable: true,
      ObservableLink: getDashboardLink(hostSnapshotId, { pathname: `${agentsPath}/dashboard` })
    },
    {
      label: t('in-automation:actionHistory.log'),
      value: t('in-automation:actionHistory.viewLog'),
      isLink: true,
      ObservableLink: link
    }
  ];

  if (errorMessage) {
    tableData.push({ label: t('in-automation:actionHistory.errorMessage'), value: errorMessage });
  }

  if (targetsnapshotid) {
    tableData.push({
      label: t('in-automation:actionHistory.targetSnapshotId'),
      value: targetsnapshotid,
      isLink: true,
      isObservable: true,
      ObservableLink: getDashboardLink(targetsnapshotid, { pathname: '/physical/dashboard' })
    });
  }

  return (
    <table className={locals.ActionInstanceDetailsTable}>
      <thead className={locals.headerRow}>
        <tr>
          <th>{t('in-automation:actionHistory.property')}</th>
          <th>{t('in-automation:actionHistory.value')}</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map(({ label, value, isLink, ObservableLink, stringLink }) => (
          <tr key={label}>
            <td>{label}</td>
            <td>
              {isLink ? (
                <Link target="_blank" href={stringLink ?? undefined} href$={ObservableLink ?? undefined}>
                  {value}
                </Link>
              ) : (
                value
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
