/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { EventSpecificationInfo, PaginatedResult, Policy, Result, Trigger, TriggerType } from '@instana/types';
import { Button, Spacer, Stack, Typography } from '@instana/components';

import {
  isApplicationSmartAlert,
  isEventSpecification,
  isGlobalApplicationSmartAlert,
  isInfraSmartAlert,
  isMobileAppSmartAlert,
  isSloSmartAlert,
  isSyntheticsSmartAlert,
  isWebsiteSmartAlert,
  TriggerSpecification
} from 'in-automation/types';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import { createTagsUrlParameter, createTypeUrlParameter } from 'in-automation/navigation/urlParameters';
import useNavigateToPolicyDetails from 'in-automation/navigation/hooks/useNavigateToPolicyDetails';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { getSubtitle as getSubtitleInfra } from 'in-alerting/smart-alerts/infrastructure/Alerts';
import { getSubtitle as getSubtitleMobileApp } from 'in-alerting/smart-alerts/mobileApp/Alerts';
import usePolicies, { refresh, usePaginatedPolicies } from 'in-automation/Policies/usePolicies';
import { EventName } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/Events';
import { getSubtitle as getSubtitleWebsite } from 'in-alerting/smart-alerts/websites/Alerts';
import { actionNameColumn, nameColumn } from 'in-automation/PolicyTable/columnDefinitions';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import usePoliciesFilterUrlState from 'in-automation/Policies/usePoliciesFilterUrlState';
import { getSubtitle as getSubtitleLog } from 'in-alerting/smart-alerts/logs/Alerts';
import { PolicyTypeFilter } from 'in-automation/PolicyTable/tableFilters';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { hasError, isLoading, mapData } from 'in-services/util/result';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { TagsFilter } from 'in-automation/components/tableFilters';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import WithSubscript from 'in-settings/components/WithSubscript';
import useTriggers from 'in-automation/Policies/useTriggers';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { deletePolicy } from 'in-automation/api';
import { role } from 'in-stores/user';
import { t, Trans } from 'in-i18n';

import locals from './PolicyTable.mless';

const pathSegment = '/policies';
const matrixPrefix = '';

type PolicyTableEntity = Policy & { trigger: TriggerSpecification | undefined };

interface PlociciesProps {
  actionId?: string;
  hideFilters?: boolean;
}

export default function Policies({ actionId, hideFilters = false }: Readonly<PlociciesProps>) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 10,
    paginationResettingUrlParameters: [
      createTypeUrlParameter(pathSegment, matrixPrefix),
      createTagsUrlParameter(pathSegment, matrixPrefix)
    ]
  });
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const [{ tags, type }, setFilter] = usePoliciesFilterUrlState({ pathSegment, matrixPrefix });

  const policies = usePolicies(actionId);

  const paginatedPolicies = usePaginatedPolicies({ policies, serverTableUrlState, setServerTableUrlState, tags, type });
  const availableTags = [...new Set(policies?.data?.flatMap(({ tags }) => tags ?? []))];

  const triggers = useTriggers();

  function getTriggerItem(triggerType: TriggerType, policy: Policy) {
    if (isLoading(triggers[triggerType])) {
      return null;
    }

    if (hasError(triggers[triggerType])) {
      return policy.trigger;
    }

    // @ts-ignore
    return triggers?.[triggerType]?.data?.find(trigger => trigger.id === policy.trigger.id);
  }

  // @ts-ignore
  const result: Result<PaginatedResult<PolicyTableEntity>> = mapData(paginatedPolicies, data => ({
    ...data,
    items: data.items.map(policy => {
      const triggerType = policy.trigger.type;
      const triggerItem = getTriggerItem(triggerType, policy);
      return {
        ...policy,
        trigger: triggerItem
      };
    })
  }));

  const navigateToPolicyDetails = useNavigateToPolicyDetails();
  const totalHits = result.data?.totalHits;
  if (actionId) {
    const excludedColumns = ['actionName', 'actions'];
    columnDefinition = columnDefinition.filter(column => !excludedColumns.includes(column.id));
  }

  return (
    <ServerTablePresenter<PolicyTableEntity, ServerTablePresenterProps<PolicyTableEntity>>
      onChange={setServerTableUrlState}
      pageSize={pageSize}
      page={page}
      searchPlaceholder={t('in-automation:policies.searchPolicies')}
      searchMaxWidth={180}
      cardTitle={
        isLoading(policies) || !totalHits
          ? t('in-automation:policies.policies')
          : t('in-automation:policies.policiesWithCount', { count: totalHits })
      }
      rightHeader={
        hideFilters ? null : (
          <>
            {role?.canConfigureAutomationPolicies && (
              <Button kind="action" onClick={() => navigateToPolicyDetails()} icon="lib_openclose_add_circle_outline">
                {t('in-automation:policies.newPolicy')}
              </Button>
            )}
            <>
              <Spacer horizontal="small" />
              <Stack direction="horizontal">
                <PolicyTypeFilter type={type ?? null} setType={type => setFilter({ type: type ?? undefined })} />
                <TagsFilter availableTags={availableTags} tags={tags} setTags={tags => setFilter({ tags })} />
              </Stack>
              <Spacer horizontal="small" />
            </>
          </>
        )
      }
      orderBy={orderBy}
      orderDirection={orderDirection}
      query={query}
      result={result}
      columnDefinitions={columnDefinition}
      noDataMessage={t('in-automation:policies.noPolicies')}
      fixedLayout
    />
  );
}

function EventNameWithoutTriggerInfo({ entity }: { entity: Trigger }) {
  const { name } = entity;

  return (
    <Tooltip content={name} align="topLeft" delay={500}>
      <WithSubscript subscript={entity.type === 'builtinEvent' ? 'Built-in' : ''}>
        <span className={locals.ellipsis}>{name}</span>
      </WithSubscript>
    </Tooltip>
  );
}

function PoliciesMoreMenu({ policy }: { policy: PolicyTableEntity }) {
  const navigateToPolicyDetails = useNavigateToPolicyDetails();
  if (!role?.canConfigureAutomationPolicies) return null;
  return (
    <Stack align="end">
      <MoreMenu kind="subtle">
        <MoreMenuButton icon="lib_actions_edit" onClick={() => navigateToPolicyDetails(policy.id, false)}>
          {t('in-automation:edit')}
        </MoreMenuButton>
        <MoreMenuButton icon="lib_actions_copy" onClick={() => navigateToPolicyDetails(policy.id, true)}>
          {t('in-automation:copy')}
        </MoreMenuButton>
        <MoreMenuButton icon="lib_actions_delete" onClick={() => showConfirmationDialog(policy)}>
          {t('in-automation:delete')}
        </MoreMenuButton>
      </MoreMenu>
    </Stack>
  );
}

let columnDefinition: ColumnDefinition<PolicyTableEntity>[] = [
  nameColumn,
  {
    id: 'trigger',
    label: t('in-automation:policies.eventTrigger'),
    getContent: item => {
      if (isEventSpecification(item.trigger)) {
        return (
          <div className={locals.eventNameWrapper}>
            {(item.trigger as EventSpecificationInfo).entityType ? (
              <EventName hasRowNavigation={false} entity={item.trigger} />
            ) : (
              <EventNameWithoutTriggerInfo entity={item.trigger} />
            )}
          </div>
        );
      }

      if (isWebsiteSmartAlert(item.trigger)) {
        return (
          <NameColumnCell config={item.trigger} getSubtitle={config => getSubtitleWebsite(config.rule, config.rules)} />
        );
      }
      if (isApplicationSmartAlert(item.trigger)) {
        return (
          <div className={locals.alertName}>
            <NameColumnCell config={item.trigger} />
          </div>
        );
      }

      if (isMobileAppSmartAlert(item.trigger)) {
        return (
          <NameColumnCell
            config={item.trigger}
            getSubtitle={config => getSubtitleMobileApp(config.rule, config.threshold)}
          />
        );
      }
      if (isInfraSmartAlert(item.trigger)) {
        return (
          <NameColumnCell
            config={item.trigger}
            getSubtitle={config => getSubtitleInfra(config.rule, config.threshold, config.forecastingConfig)}
          />
        );
      }
      if (isGlobalApplicationSmartAlert(item.trigger)) {
        return <SimpleListNameColumn config={item.trigger} />;
      }
      if (isSyntheticsSmartAlert(item.trigger)) {
        return (
          <NameColumnCell
            config={item.trigger}
            getSubtitle={() => t('in-alerting:smartAlerts.synthetics.alertList.numberOfFailures')}
            renderName={config => replaceTitlePlaceholdersWithMarkup(config.name)}
          />
        );
      }
      if (isSloSmartAlert(item.trigger)) {
        return <NameColumnCell config={item.trigger} />;
      }
      if (item.trigger && item.trigger.threshold) {
        return <NameColumnCell config={item.trigger} getSubtitle={config => getSubtitleLog(config.threshold)} />;
      }

      return null;
    },
    width: 23,
    sortable: true
  },
  actionNameColumn,
  tagsColumn as ColumnDefinition<Policy>,
  {
    label: '',
    id: 'actions',
    sortable: false,
    width: 5,
    getContent: policy => <PoliciesMoreMenu policy={policy} />
  }
];

function showConfirmationDialog(policy: Policy) {
  const { id, name } = policy;
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-automation:deleteDialog.pleaseConfirm')}
      description={
        <Typography variant="body-regular">
          <Trans i18nKey="in-automation:deleteDialog.pleaseConfirmMsg" values={{ name }} />
        </Typography>
      }
      confirmButtonLabel={t('in-automation:deleteDialog.delete')}
      onSubmit={() => {
        close();
        // TODO: Tracker for policy delete
        onDelete(id);
      }}
    />
  );
}

function onDelete(id: string) {
  deletePolicy(id).once(
    () => {
      onDeleteSuccess();
      refresh();
    },
    () => {
      onDeleteFailed();
    }
  );
}

function onDeleteSuccess() {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-automation:policies.deleteDialog.success')
    },
    'policy-delete-info'
  );
}

function onDeleteFailed() {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      content: t('in-automation:policies.deleteDialog.failure')
    },
    'policy-delete-error'
  );
}
