/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import classNames from 'classnames';
import { isEmpty } from 'lodash';

import { ExpandableGroup, IconButton, Li, Link, Spacer, SvgIcon, Ul } from '@instana/components';
import { ActionInstance, ActionType, ActorType, Field } from '@instana/types';
import { just, Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import {
  getEntityIdView,
  securityAndAccessAccessControlApiTokens,
  securityAndAccessAccessControlUsers
} from 'in-settings/navigation/paths';
import useHrefToActionDashboard from 'in-automation/navigation/hooks/useHrefToActionDashboard';
import { ACTION_FIELD_TRANSLATIONS } from 'in-automation/components/ActionHistory/constants';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { policyDetailsFullyQualified } from 'in-automation/navigation/paths';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { ACTION_TRANSLATIONS, ACTION_TYPE } from 'in-automation/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { Di, Dl } from 'in-components/HorizontalDescriptionList';
import { base64ToUtf8 } from 'in-automation/utils/actionField';
import { formatDateTime } from 'in-services/formatters/date';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { eventsPath } from 'in-events/navigation/paths';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Code from 'in-components/Code';
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
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { createHref, location } = useNavigation();
  const getDashboardLink = useGetDashboardLink();
  const handleToggle = () => setIsExpanded(expanded => !expanded);
  function getPolicyView(id: string): string {
    const path = location;
    path.pathname = policyDetailsFullyQualified;
    setOrDeleteMatrixKey(path, '/policies', 'id', id);
    delete path.query.from;
    return createHref(path);
  }

  function getLinkToEventDetails(id: string) {
    const path = location;
    path.pathname = eventsPath;
    setOrDeleteMatrixKey(path, eventsPath, 'view', 'issue');
    setOrDeleteMatrixKey(path, eventsPath, 'eventId', id);
    return createHref(path);
  }

  const hrefToActionDashboard = useHrefToActionDashboard();

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
    actorId,
    actionSnapshot
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
      stringLink: type === ACTION_TYPE.EXTERNAL ? undefined : hrefToActionDashboard(actionId),
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
                  className={locals.copyIcon}
                  color="var(--cds-link-primary)"
                  onClick={stopPropagationAndPreventDefault}
                  type="lib_actions_copy"
                  size="compact"
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
            const rawValue = metadata?.find(data => data.name === 'hostsLimit')?.value ?? '';
            const hostsLimit = rawValue ? rawValue.split(',') : [];
            return hostsLimit.length > 0 ? (
              hostsLimit.map(host => (
                <Li
                  key={host}
                  className={classNames({
                    [locals.singleHostLimit]: hostsLimit.length === 1,
                    [locals.hostLimit]: true
                  })}
                >
                  {host}
                </Li>
              ))
            ) : (
              <span>-</span>
            );
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

  const renderRow = (
    label: string,
    value: React.ReactNode,
    isLink?: boolean,
    ObservableLink?: Observable<string> | null,
    stringLink?: string | null,
    showCondition?: boolean,
    actionLane?: boolean,
    inActionLane?: boolean
  ) => {
    if (!showCondition || (inActionLane && !actionLane) || (!inActionLane && actionLane)) return null;

    return (
      <Di key={label} title={label}>
        {/* <td>{label}</td> */}

        {isLink ? (
          <Link className={locals.detailsLink} target="_blank" href={ObservableLink ?? stringLink ?? undefined}>
            {value} <SvgIcon size="xs" type="lib_views_external_link" color="var(--cds-link-primary)" />
          </Link>
        ) : (
          value
        )}
      </Di>
    );
  };

  return (
    <div
      className={classNames({
        [locals.instanceTabContent]: !inActionLane
      })}
    >
      <Dl>
        {tableData.map(
          ({ label, value, isLink, ObservableLink, stringLink, showCondition = true, actionLane = false }) =>
            renderRow(label, value, isLink, ObservableLink, stringLink, showCondition, actionLane, inActionLane)
        )}
      </Dl>
      <Spacer vertical="large" />
      {actionSnapshot && (
        <ExpandableGroup
          expanded={isExpanded}
          onToggle={handleToggle}
          title={t('in-automation:actionHistory.actionSnapshotDetails')}
        >
          <ActionDetails type={type} actionSnapshot={actionSnapshot ?? ''} />
        </ExpandableGroup>
      )}
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

function ActionDetails({ type, actionSnapshot }: { type: ActionType; actionSnapshot: string }) {
  const parsedSnapshot = JSON.parse(actionSnapshot);
  const { fields } = parsedSnapshot;

  const decodeBase64 = (encodedValue: string) => {
    return base64ToUtf8(encodedValue);
  };

  return (
    <div>
      {fields?.map((field: Field) => {
        if (field.name === 'header' || field.name === 'authen') {
          // Parse JSON if field is headers or authentication(http fields)
          const parsedJsonField = JSON.parse(field.value);
          return (
            <>
              <Spacer vertical="small" />
              <div className={locals.parsedFields} key={field.name}>
                <div className={locals.headerField}>
                  <h3>{ACTION_FIELD_TRANSLATIONS[field.name]}</h3>
                </div>

                <div>
                  {Object.entries(parsedJsonField).map(([key, value]) => (
                    <Di key={key} title={key}>
                      {value}
                    </Di>
                  ))}
                </div>
              </div>
              <Spacer vertical="small" />
            </>
          );
        }

        // For other fields, display normally
        return (
          <Di
            key={field.name}
            title={
              field.name === 'body' && (type === ACTION_TYPE.JIRA || type === ACTION_TYPE.GITLAB)
                ? ACTION_FIELD_TRANSLATIONS['description']
                : ACTION_FIELD_TRANSLATIONS[field.name]
            }
          >
            {field.encoding === 'base64' ? (
              field.name === 'script_ssh' ? (
                <Code withExpandButton withoutCopyButton code={decodeBase64(field.value)} lang={'bash'} softWrap />
              ) : (
                decodeBase64(field.value) ?? ''
              )
            ) : (
              field.value
            )}
          </Di>
        );
      })}
    </div>
  );
}
