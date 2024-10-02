/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import React from 'react';

import { Li, Link, Ul, IconButton, SvgIcon, DataTable as CarbonTable } from '@instana/components';
import { Observable, just } from '@instana/observables';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  getEntityIdView,
  teamSettingsAccessControlUsers,
  teamSettingsAccessControlApiTokens
} from 'in-settings/navigation/paths';
import { isAnsible, isGithub, isGitlab, isJira, isExternal } from 'in-automation/ActionCatalog/shared';
import useHrefToActionDetails from 'in-automation/navigation/hooks/useHrefToActionDetails';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { policiesDetailsFullyQualified } from 'in-automation/navigation/paths';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { clickTurboLinkForDetailsTracker } from 'in-automation/tracker';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { formatDateTime } from 'in-services/formatters/date';
import { getType } from 'in-automation/ActionCatalog/shared';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { eventsPath } from 'in-events/navigation/paths';
import { ActionInstance, ActorType } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ActionInstanceDetail.mless';

export default function DetailTab({
  id,
  properties,
  inActionLane = false
}: {
  id?: string;
  properties: ActionInstance;
  inActionLane?: boolean;
}) {
  const { createHref, location } = useNavigation();
  const getDashboardLink = useGetDashboardLink();

  function getPolicyView(id: string): string {
    const path = location;
    path.pathname = policiesDetailsFullyQualified;
    setOrDeleteMatrixKey(path, '/policies', 'id', id);
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

  const hrefToActionDetails = useHrefToActionDetails();

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
    output,
    actorId
  } = properties;

  const timeConfig = useTimeConfig();

  const tagFilterExpression = tagFilter('log.custom', 'EQUALS', id ?? '', 'actionInstanceId');
  const link = useLinkToLogs({ tagFilterExpression: [tagFilterExpression], timeConfig });

  const snapshot = useObservable(
    () => (hostSnapshotId ? getSnapshot(hostSnapshotId).map(snapshot => snapshot.toJS()) : just({})),
    [hostSnapshotId]
  );

  const tableData = [
    {
      label: t('in-automation:actionHistory.errorMessage'),
      value: errorMessage,
      showCondition: errorMessage,
      actionLane: inActionLane
    },
    {
      label: t('in-automation:actionHistory.log'),
      value: t('in-automation:actionHistory.viewLog'),
      isLink: true,
      stringLink: link,
      showCondition:
        (output === null || output?.trim().length === 0) &&
        status !== 'SUBMITTED' &&
        status !== 'TIMEOUT' &&
        !isExternal(type)
    },
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
    {
      label: t('in-automation:actionHistory.initiator'),
      value: actorName,
      isLink: true,
      showCondition:
        actorName &&
        actorType !== 'ACTOR_UNKNOWN' &&
        ((actorType === 'USER' && role?.canConfigureUsers) ||
          (actorType === 'APITOKEN' && role?.canConfigureApiTokens) ||
          actorType === 'POLICY'),
      ObservableLink: actorType === 'POLICY' ? undefined : getActorLink(actorType, actorId),
      stringLink: actorType === 'POLICY' ? getPolicyView(actorId ?? '') : undefined
    },
    {
      label: t('in-automation:actionHistory.event'),
      value: problemText,
      isLink: true,
      showCondition: eventId,
      actionLane: inActionLane,
      stringLink: getLinkToEventDetails(eventId ?? '')
    },
    {
      label: t('in-automation:actionHistory.host'),
      value: snapshot?.label ?? hostSnapshotId,
      isLink: true,
      isObservable: true,
      showCondition: hostSnapshotId && snapshot,
      stringLink: getDashboardLink(hostSnapshotId ?? '', { pathname: `${agentsPath}/dashboard` })
    },
    {
      label: t('in-automation:titleActionType'),
      value: getType(type),
      actionLane: inActionLane
    },
    {
      label: t('in-automation:actionHistory.action'),
      value: actionName,
      isLink: true,
      isObservable: true,
      stringLink:
        type === 'EXTERNAL'
          ? metadata?.find(obj => obj.name === 'actionEntityURL')?.value
          : hrefToActionDetails(actionId),
      onClick: () =>
        handleTracking(
          actionName,
          inActionLane,
          type === 'EXTERNAL' ? metadata?.find(obj => obj.name === 'actionEntityURL')?.value : undefined
        ),
      actionLane: inActionLane
    },
    {
      label: t('in-automation:actionHistory.actionInstanceId'),
      actionLane: inActionLane,
      value: (
        <div className={locals.actionInstanceIdContent}>
          <span className={locals.actionInstanceId}>{id}</span>
          <CopyToClipboard getText={() => id ?? ''}>
            {refSetter => (
              <span ref={refSetter}>
                <IconButton
                  color={themes.default.ids.color.option.blue['500']}
                  onClick={stopPropagationAndPreventDefault}
                  type="lib_actions_copy"
                />
              </span>
            )}
          </CopyToClipboard>
        </div>
      )
    },
    {
      label: t('in-automation:actionHistory.hostsLimit'),
      actionLane: false,
      showCondition: isAnsible(type),
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
    }
  ];
  if (isAnsible(type)) {
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

  const carbonHeaders = [
    {
      key: t('in-automation:actionHistory.property'),
      header: t('in-automation:actionHistory.property')
    },
    {
      key: t('in-automation:actionHistory.value'),
      header: t('in-automation:actionHistory.value')
    }
  ];

  const carbonRows = tableData
    .filter(({ showCondition = true, actionLane = false }) => {
      if (!showCondition || (inActionLane && !actionLane) || (!inActionLane && actionLane)) {
        return false;
      }
      return true;
    })
    .map(({ label, value, isLink, ObservableLink, stringLink, onClick }) => {
      return {
        id: label,
        [t('in-automation:actionHistory.property')]: label,
        [t('in-automation:actionHistory.value')]: isLink ? (
          <Link
            target="_blank"
            className={locals.detailsLink}
            onClick={onClick}
            href={ObservableLink ?? stringLink ?? undefined}
          >
            {value} <SvgIcon size="s" type="lib_views_external_link" color="var(--cds-link-primary)" />{' '}
          </Link>
        ) : (
          value
        )
      };
    });

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
              {value} <SvgIcon size="s" type="lib_views_external_link" color="var(--cds-link-primary)" />
            </Link>
          ) : (
            value
          )}
        </td>
      </tr>
    );
  };

  return (
    <div
      className={classNames({
        [locals.instanceTabContent]: !inActionLane
      })}
    >
      {carbonTableEnabled ? (
        <CarbonTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
      ) : (
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
              ({
                label,
                value,
                isLink,
                ObservableLink,
                stringLink,
                showCondition = true,
                actionLane = false,
                onClick
              }) =>
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
      )}
    </div>
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
