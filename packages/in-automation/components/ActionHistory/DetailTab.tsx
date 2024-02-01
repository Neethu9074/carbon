/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { Observable, just } from '@instana/observables';
import { Li, Link, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import {
  getEntityIdView,
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlApiTokens
} from 'in-settings/navigation/paths';
import { actionCatalogPath, policiesDetailsFullyQualified } from 'in-automation/navigation/paths';
import { isAnsible, isGithub, isGitlab, isJira } from 'in-automation/ActionCatalog/shared';
import { getStatus } from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { clickTurboLinkForDetailsTracker } from 'in-automation/tracker';
import { automationPoliciesEnabled } from 'in-services/featureFlags';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import { getType } from 'in-automation/ActionCatalog/shared';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { eventsPath } from 'in-events/navigation/paths';
import { ActionInstance, ActorType } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

import locals from './ActionInstanceDetail.mless';

export default function DetailTab({
  id,
  properties,
  inActionLane = false
}: {
  id: string;
  properties: ActionInstance;
  inActionLane?: boolean;
}) {
  const { createHref, location } = useNavigation();

  function getPolicyView(id: string): string {
    const path = location;
    path.pathname = policiesDetailsFullyQualified;
    setOrDeleteMatrixKey(path, '/policies', 'policyId', id);
    return createHref(path);
  }

  function getLinkToEventDetails(id: string) {
    const path = location;
    path.pathname = eventsPath;
    setOrDeleteMatrixKey(path, eventsPath, 'view', 'issue');
    setOrDeleteMatrixKey(path, eventsPath, 'eventId', id);
    return createHref(path);
  }

  const handleTracking = (name: string, actionLane: boolean, link: string | undefined) => {
    if (link) {
      clickTurboLinkForDetailsTracker({
        actionName: name,
        actionLink: link,
        actionType: 'Turbonomic',
        view: actionLane ? 'Actions lane' : 'Action history'
      });
    }
  };

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
  const theme = useTheme();

  const tagFilterExpression = tagFilter('log.custom', 'EQUALS', id, 'actionInstanceId');
  const link = getLinkToAnalyze({ tagFilterExpression: [tagFilterExpression], timeConfig });

  const snapshot = useObservable(
    () => (hostSnapshotId ? getSnapshot(hostSnapshotId).map(snapshot => snapshot.toJS()) : just({})),
    [hostSnapshotId]
  );
  const tableData = [
    { label: t('in-automation:actionHistory.status'), value: getStatus(status), actionLane: inActionLane },
    {
      label: t('in-automation:actionHistory.startTime'),
      value: startDate ? formatDateTime(startDate) : formatDateTime(null),
      actionLane: inActionLane
    },
    {
      label: t('in-automation:actionHistory.endTime'),
      actionLane: inActionLane,
      value: endDate ? formatDateTime(endDate) : formatDateTime(null)
    },
    { label: t('in-automation:actionHistory.returnCode'), value: returnCode },
    { label: t('in-automation:actionHistory.eventName'), value: problemText, showCondition: eventId },
    {
      label: t('in-automation:actionHistory.initiator'),
      value: actorName,
      isLink: true,
      showCondition:
        actorName &&
        actorType !== 'ACTOR_UNKNOWN' &&
        ((actorType === 'USER' && role?.canConfigureUsers) ||
          (actorType === 'APITOKEN' && role?.canConfigureApiTokens) ||
          (actorType === 'POLICY' && automationPoliciesEnabled && role?.canConfigureAutomationPolicies)),
      ObservableLink: actorType === 'POLICY' ? undefined : getActorLink(actorType, actorId),
      stringLink:
        actorType === 'POLICY' && automationPoliciesEnabled && role?.canConfigureAutomationPolicies
          ? getPolicyView(actorId ?? '')
          : undefined
    },
    {
      label: t('in-automation:actionHistory.eventId'),
      value: eventId,
      isLink: true,
      showCondition: eventId,
      actionLane: inActionLane,
      stringLink: getLinkToEventDetails(eventId ?? '')
    },
    {
      label: t('in-automation:actionHistory.hostSnapshot'),
      value: snapshot?.label ?? hostSnapshotId,
      isLink: true,
      isObservable: true,
      showCondition: hostSnapshotId && snapshot,
      ObservableLink: getDashboardLink(hostSnapshotId ?? '', { pathname: `${agentsPath}/dashboard` })
    },
    {
      label: t('in-automation:actionHistory.log'),
      value: t('in-automation:actionHistory.viewLog'),
      isLink: true,
      actionLane: inActionLane,
      ObservableLink: link
    },
    {
      label: t('in-automation:titleActionType'),
      value: getType(type),
      actionLane: inActionLane
    },
    {
      label: t('in-automation:actionHistory.actionContent'),
      value: actionName,
      isLink: true,
      isObservable: true,
      ObservableLink: type === 'EXTERNAL' ? undefined : getEntityIdView(actionCatalogPath, actionId),
      stringLink: type === 'EXTERNAL' ? metadata?.find(obj => obj.name === 'actionEntityURL')?.value : undefined,
      onClick: () =>
        handleTracking(
          actionName,
          inActionLane,
          type === 'EXTERNAL' ? metadata?.find(obj => obj.name === 'actionEntityURL')?.value : undefined
        ),
      actionLane: inActionLane
    },
    { label: t('in-automation:actionHistory.actionInstanceId'), value: id }
  ];

  if (isAnsible(type)) {
    tableData.push({
      label: t('in-automation:actionHistory.hostsLimit'),
      actionLane: false,
      value: (
        <Ul framed={false}>
          {(() => {
            const hostsLimit = (metadata?.find(data => data.name === 'hostsLimit')?.value ?? '').split(',');
            return hostsLimit.map(host => (
              <Li key={host} className={classNames({ [locals.singleHostLimit]: hostsLimit.length === 1 })}>
                {host}
              </Li>
            ));
          })()}
        </Ul>
      )
    });
    const ansibleUrl = metadata?.find(data => data.name === 'ansibleUrl');
    const ansibleJobId = metadata?.find(data => data.name === 'ansibleJobId');
    if (ansibleUrl && ansibleJobId) {
      const jobUrl = `${ansibleUrl.value}/#/jobs/playbook/${ansibleJobId.value}`;
      tableData.push({
        label: t('in-automation:actionHistory.ansibleJob'),
        value: ansibleJobId.value ?? '',
        isLink: true,
        stringLink: jobUrl,
        actionLane: false,
        showCondition: ansibleJobId.value && ansibleUrl.value ? ansibleUrl.value : ''
      });
    }
  }

  if (isGithub(type) || isGitlab(type) || isJira(type)) {
    const id = metadata?.find(data => data.name === 'id');
    const url = metadata?.find(data => data.name === 'url');
    if (id && url) {
      const ticketUrlValue = `${url.value}`;
      tableData.push({
        label: isJira(type) ? t('in-automation:actionHistory.taskUrl') : t('in-automation:actionHistory.issueUrl'),
        value: id.value ?? '',
        isLink: true,
        stringLink: ticketUrlValue,
        actionLane: false,
        showCondition: id.value && url.value ? id.value : ''
      });
    }
  }

  if (errorMessage) {
    tableData.push({ label: t('in-automation:actionHistory.errorMessage'), value: errorMessage });
  }

  const renderRow = (
    label: string,
    value: React.ReactNode,
    isLink?: boolean,
    ObservableLink?: Observable<string> | null,
    stringLink?: string | null,
    showCondition?: string | boolean,
    actionLane?: boolean,
    inActionLane?: boolean,
    onClick?: () => void
  ) => {
    if (!showCondition || (inActionLane && !actionLane) || (!inActionLane && actionLane)) return null;

    return (
      <tr key={label}>
        <td>{label}</td>
        <td>
          {isLink ? (
            <Link
              className={locals.detailsLink}
              target="_blank"
              onClick={onClick}
              href={ObservableLink ?? stringLink ?? undefined}
            >
              {value} <SvgIcon size="s" type="lib_views_external_link" color={theme.ids.color.option.blue['500']} />
            </Link>
          ) : (
            value
          )}
        </td>
      </tr>
    );
  };

  return (
    <table
      className={classNames({
        [locals.ActionInstanceDetailsTable]: true,
        [locals.ActionLaneTable]: inActionLane
      })}
    >
      <thead className={locals.headerRow}>
        <tr>
          <th>{t('in-automation:actionHistory.property')}</th>
          <th>{t('in-automation:actionHistory.value')}</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map(
          ({ label, value, isLink, ObservableLink, stringLink, showCondition = true, actionLane = false, onClick }) =>
            renderRow(
              label,
              value,
              isLink,
              ObservableLink,
              stringLink,
              showCondition,
              actionLane,
              inActionLane,
              onClick
            )
        )}
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
