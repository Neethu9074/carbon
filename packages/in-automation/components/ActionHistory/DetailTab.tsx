/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ActionInstanceMetadataEntry, ActorType } from '@instana/types';
import { DateFormatterInput } from '@instana/format-date';
import { Li, Link, Ul } from '@instana/components';
import { SvgIcon } from '@instana/components';

import {
  getEntityIdView,
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlApiTokens
} from 'in-settings/navigation/paths';
import { getStatus } from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { actionCatalogPath } from 'in-automation/navigation/paths';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { isAnsible } from 'in-automation/ActionCatalog/shared';
import { formatDateTime } from 'in-services/formatters/date';
import { getType } from 'in-automation/ActionCatalog/shared';
import { eventsPath } from 'in-events/navigation/paths';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './ActionInstanceDetail.mless';

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
  targetSnapshotId: string;
  type: string;
  metadata: ActionInstanceMetadataEntry[];
  actorType?: ActorType;
  actorId?: string;
  actorName?: string;
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
    endDate,
    metadata,
    type,
    actorType,
    actorName,
    actorId
  } = properties;

  const timeConfig = useTimeConfig();

  const tagFilterExpression = tagFilter('log.custom', 'EQUALS', id, 'actionInstanceId');
  const link = getLinkToAnalyze({ tagFilterExpression: [tagFilterExpression], timeConfig });

  const tableData = [
    { label: t('in-automation:actionHistory.status'), value: getStatus(status) },
    { label: t('in-automation:actionHistory.startTime'), value: formatDateTime(startDate) },
    {
      label: t('in-automation:actionHistory.endTime'),
      value: endDate ? formatDateTime(endDate) : formatDateTime(null)
    },
    { label: t('in-automation:actionHistory.returnCode'), value: returnCode },
    { label: t('in-automation:actionHistory.eventName'), value: problemText },
    {
      label: t('in-automation:actionHistory.initiator'),
      value: actorName,
      isLink: true,
      showCondition:
        actorName &&
        actorType !== 'ACTOR_UNKNOWN' &&
        ((actorType === 'USER' && role?.canConfigureUsers) ||
          (actorType === 'APITOKEN' && role?.canConfigureApiTokens)),
      ObservableLink: getActorLink(actorType, actorId)
    },
    {
      label: t('in-automation:actionHistory.eventId'),
      value: eventId,
      isLink: true,
      showCondition: eventId,
      stringLink: getLinkToEventDetails(eventId)
    },
    {
      label: t('in-automation:actionHistory.hostSnapshotId'),
      value: hostSnapshotId,
      isLink: true,
      isObservable: true,
      showCondition: hostSnapshotId,
      ObservableLink: getDashboardLink(hostSnapshotId, { pathname: `${agentsPath}/dashboard` })
    },
    {
      label: t('in-automation:actionHistory.log'),
      value: t('in-automation:actionHistory.viewLog'),
      isLink: true,
      ObservableLink: link
    },
    {
      label: t('in-automation:titleActionType'),
      value: getType(type)
    },
    {
      label: t('in-automation:actionHistory.actionContent'),
      value: actionName,
      isLink: true,
      isObservable: true,
      ObservableLink: getEntityIdView(actionCatalogPath, actionId)
    },
    { label: t('in-automation:actionHistory.actionInstanceId'), value: id }
  ];

  if (isAnsible(type)) {
    tableData.push({
      label: t('in-automation:actionHistory.hostsLimit'),
      value: (
        <Ul framed={false}>
          {(metadata.find(data => data.name === 'hostsLimit')?.value ?? '').split(',').map(host => (
            <Li key={host}>{host}</Li>
          ))}
        </Ul>
      )
    });
    const ansibleUrl = metadata.find(data => data.name === 'ansibleUrl');
    const ansibleJobId = metadata.find(data => data.name === 'ansibleJobId');
    if (ansibleUrl && ansibleJobId) {
      const jobUrl = `${ansibleUrl.value}/#/jobs/playbook/${ansibleJobId.value}`;
      tableData.push({
        label: t('in-automation:actionHistory.ansibleJob'),
        value: ansibleJobId.value ?? '',
        isLink: true,
        stringLink: jobUrl,
        showCondition: ansibleJobId.value && ansibleUrl.value ? ansibleUrl.value : ''
      });
    }
  }

  if (errorMessage) {
    tableData.push({ label: t('in-automation:actionHistory.errorMessage'), value: errorMessage });
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
        {tableData.map(({ label, value, isLink, ObservableLink, stringLink, showCondition = true }) => {
          if (showCondition) {
            return (
              <tr key={label}>
                <td>{label}</td>
                <td>
                  {isLink ? (
                    <Link
                      className={locals.detailsLink}
                      target="_blank"
                      href={ObservableLink ?? stringLink ?? undefined}
                    >
                      {value} <SvgIcon type="lib_views_external_link" color={theme.lib.colors.blue800} />
                    </Link>
                  ) : (
                    value
                  )}
                </td>
              </tr>
            );
          }
          return null; // If condition is false, don't render anything.
        })}
      </tbody>
    </table>
  );
}

function getActorLink(actorType?: ActorType, actorId?: string) {
  switch (actorType) {
    case 'USER':
      return getEntityIdView(teamSettingsAccessControlUsers, actorId ?? '');
    case 'APITOKEN':
      return getEntityIdView(teamSettingsAccessControlApiTokens, actorId ?? '');
    default:
      return null;
  }
}
