/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { DateFormatterInput } from '@instana/format-date';
import { Link } from '@instana/components';

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

interface property {
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
}
export default function DetailTab({ id, properties }: { id: string; properties: property }) {
  const { createHref, location } = useNavigation();
  function getLinkToEventDetails(eventsPath: string, id: string) {
    const path = location;
    path.pathname = eventsPath;
    setOrDeleteMatrixKey(path, eventsPath, 'view', 'issue');
    setOrDeleteMatrixKey(path, eventsPath, 'eventId', id);
    return createHref(path);
  }

  const timeConfig = useTimeConfig();
  const tagFilterExpression = tagFilter('log.custom', 'EQUALS', id, 'actionInstanceId');
  const link = getLinkToAnalyze({ tagFilterExpression: [tagFilterExpression], timeConfig });

  return (
    <table className={locals.ActionInstanceDetailsTable}>
      <tr className={locals.headerRow}>
        <th>{t('in-automation:actionHistory.property')}</th>
        <th>{t('in-automation:actionHistory.value')}</th>
      </tr>
      <tr>
        <td>{t('in-automation:actionHistory.actionInstanceId')}</td>
        <td>{id}</td>
      </tr>
      <tr>
        <td>{t('in-automation:actionHistory.eventName')}</td>
        <td> {properties.problemText}</td>
      </tr>

      <tr>
        <td>{t('in-automation:actionHistory.eventId')}</td>
        <td>
          <Link target="_blank" href={getLinkToEventDetails(eventsPath, properties.eventId)}>
            {properties.eventId}
          </Link>
        </td>
      </tr>
      <tr>
        <td>{t('in-automation:actionHistory.returnCode')}</td>
        <td>{properties.returnCode}</td>
      </tr>
      {properties.errorMessage && (
        <tr>
          <td>{t('in-automation:actionHistory.errorMessage')}</td>
          <td>{properties.errorMessage}</td>
        </tr>
      )}
      <tr>
        <td>Start Time</td>
        <td>{formatDateTime(properties.startDate)}</td>
      </tr>
      <tr>
        <td>End Time</td>
        <td>{formatDateTime(properties.endDate)}</td>
      </tr>
      <tr>
        <td>Status</td>
        <td>{getStatus(properties.status)}</td>
      </tr>
      <tr>
        <td>{t('in-automation:actionHistory.actionContent')}</td>
        <td>
          <Link target="_blank" href$={getEntityIdView(actionCatalogPath, properties.actionId)}>
            {properties.actionName}
          </Link>
        </td>
      </tr>
      <tr>
        <td>{t('in-automation:actionHistory.hostSnapshotId')}</td>
        <td>
          <Link
            target="_blank"
            href$={getDashboardLink(properties.hostSnapshotId, { pathname: `${agentsPath}/dashboard` })}
          >
            {properties.hostSnapshotId}
          </Link>
        </td>
      </tr>

      <tr>
        <td>{t('in-automation:actionHistory.log')}</td>
        <td>
          {' '}
          <Link target="_blank" href$={link}>
            {t('in-automation:actionHistory.viewLog')}
          </Link>
        </td>
      </tr>
    </table>
  );
}
