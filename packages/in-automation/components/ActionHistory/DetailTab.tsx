/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import classNames from 'classnames';
import { isEmpty } from 'lodash';
import React from 'react';

import { Li, Link, Ul, IconButton, SvgIcon, DataTable as CarbonTable } from '@instana/components';
import { ActionInstance, ActorType } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';

import {
  getEntityIdView,
  securityAndAccessAccessControlUsers,
  securityAndAccessAccessControlApiTokens
} from 'in-settings/navigation/paths';
import useHrefToActionDetails from 'in-automation/navigation/hooks/useHrefToActionDetails';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { policiesDetailsFullyQualified } from 'in-automation/navigation/paths';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { ACTION_TRANSLATIONS, ACTION_TYPE } from 'in-automation/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { formatDateTime } from 'in-services/formatters/date';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { eventsPath } from 'in-events/navigation/paths';
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
      showCondition: !isEmpty(errorMessage),
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
        type !== ACTION_TYPE.EXTERNAL
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
      actionLane: inActionLane,
      showCondition:
        !isEmpty(actorName) &&
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
      showCondition: !isEmpty(eventId) && type !== ACTION_TYPE.EXTERNAL,
      actionLane: inActionLane,
      stringLink: getLinkToEventDetails(eventId ?? '')
    },
    {
      label: t('in-automation:actionHistory.risk'),
      value: metadata?.find(data => data.name === 'riskDescription')?.value ?? '',
      showCondition: type === ACTION_TYPE.EXTERNAL,
      actionLane: inActionLane
    },
    {
      label: t('in-automation:actionHistory.host'),
      value: snapshot?.label ?? hostSnapshotId,
      isLink: true,
      isObservable: true,
      showCondition: !isEmpty(hostSnapshotId) && !isEmpty(snapshot),
      stringLink: getDashboardLink(hostSnapshotId ?? '', { pathname: `${agentsPath}/dashboard` })
    },
    {
      label: t('in-automation:titleActionType'),
      value: ACTION_TRANSLATIONS[type],
      actionLane: inActionLane
    },
    {
      label: t('in-automation:actionHistory.action'),
      value: actionName,
      isLink: type !== ACTION_TYPE.EXTERNAL ? true : false,
      isObservable: true,
      stringLink: type === ACTION_TYPE.EXTERNAL ? undefined : hrefToActionDetails(actionId),
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
                  color="var(--cds-link-primary)"
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
      showCondition: type === ACTION_TYPE.ANSIBLE,
      value: (
        <Ul framed={false}>
          {(() => {
            const hostsLimit = (metadata?.find(data => data.name === 'hostsLimit')?.value ?? '').split(',');
            return hostsLimit.map(host => (
              <Li
                key={host}
                className={classNames({
                  [locals.singleHostLimit]: hostsLimit.length === 1,
                  [locals.hostLimit]: true
                })}
              >
                {host}
              </Li>
            ));
          })()}
        </Ul>
      )
    }
  ];
  if (type === ACTION_TYPE.ANSIBLE) {
    const ansibleUrl = metadata?.find(data => data.name === 'ansibleUrl');
    const ansibleJobId = metadata?.find(data => data.name === 'ansibleJobId');
    const ansibleWorkflowJobId = metadata?.find(data => data.name === 'ansibleWorkflowId');
    if (ansibleUrl && ansibleJobId) {
      const isAnsibleWorkflow = ansibleWorkflowJobId?.value !== '';
      const templateName = isAnsibleWorkflow ? 'workflow' : 'playbook';
      const jobUrl = `${ansibleUrl.value}/#/jobs/${templateName}/${ansibleJobId.value}`;
      tableData.push({
        label: t('in-automation:actionHistory.ansibleJob'),
        value: ansibleJobId.value ?? '',
        isLink: true,
        stringLink: jobUrl,
        actionLane: false,
        showCondition: !isEmpty(ansibleJobId.value) && !isEmpty(ansibleUrl.value)
      });
    }
  }

  if ([ACTION_TYPE.GITHUB, ACTION_TYPE.GITLAB, ACTION_TYPE.JIRA].includes(type)) {
    const id = metadata?.find(data => data.name === 'id');
    const url = metadata?.find(data => data.name === 'url');
    if (id && url) {
      const ticketUrlValue = `${url.value}`;
      tableData.push({
        label:
          type === ACTION_TYPE.JIRA
            ? t('in-automation:actionHistory.taskUrl')
            : t('in-automation:actionHistory.issueUrl'),
        value: id.value ?? '',
        isLink: true,
        stringLink: ticketUrlValue,
        actionLane: false,
        showCondition: !isEmpty(id.value) && !isEmpty(url.value)
      });
    }
  }

  const carbonHeaders = [
    {
      key: 'property',
      header: t('in-automation:actionHistory.property')
    },
    {
      key: 'value',
      header: t('in-automation:actionHistory.value')
    }
  ];

  const filterRows_WhenNotShowingCondition_or_actionLaneIsDifferent = ({
    showCondition = true,
    actionLane = false
  }) => {
    if (!showCondition || (inActionLane && !actionLane) || (!inActionLane && actionLane)) {
      return false;
    }
    return true;
  };

  const carbonRows = tableData
    .filter(filterRows_WhenNotShowingCondition_or_actionLaneIsDifferent)
    .map(({ label, value, isLink, ObservableLink, stringLink }) => {
      return {
        id: label,
        property: label,
        value: isLink ? (
          <Link target="_blank" className={locals.detailsLink} href={ObservableLink ?? stringLink ?? undefined}>
            {value} <SvgIcon size="s" type="lib_views_external_link" color="var(--cds-link-primary)" />{' '}
          </Link>
        ) : (
          value
        )
      };
    });

  return (
    <div
      className={classNames({
        [locals.instanceTabContent]: !inActionLane
      })}
    >
      <CarbonTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
    </div>
  );
}

function getActorLink(actorType?: ActorType, actorId?: string) {
  switch (actorType) {
    case 'USER':
      return getEntityIdView(securityAndAccessAccessControlUsers, actorId ?? '');
    case 'APITOKEN':
      return getEntityIdView(securityAndAccessAccessControlApiTokens, actorId ?? '');
    default:
      return null;
  }
}
