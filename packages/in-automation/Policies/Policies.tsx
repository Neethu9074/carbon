/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Spacer, Stack, Typography, Button } from '@instana/components';

import {
  TriggerSpecification,
  isApplicationSmartAlert,
  isEventSpecification,
  isGlobalApplicationSmartAlert,
  isInfraSmartAlert,
  isMobileAppSmartAlert,
  isSloSmartAlert,
  isSyntheticsSmartAlert,
  isWebsiteSmartAlert
} from 'in-automation/Policies/types';
import { replaceTitlePlaceholdersWithMarkup } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import { createTagsUrlParameter, createTypeUrlParameter } from 'in-automation/navigation/urlParameters';
import { ActionInstance, PaginatedResult, Policy, EventSpecificationInfo, Trigger } from 'in-types';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import useNavigateToPolicyDetails from 'in-automation/navigation/hooks/useNavigateToPolicyDetails';
import { getSubtitle as getSubtitleInfra } from 'in-alerting/smart-alerts/infrastructure/Alerts';
import { getSubtitle as getSubtitleMobileApp } from 'in-alerting/smart-alerts/mobileApp/Alerts';
import { EventName } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import { getSubtitle as getSubtitleWebsite } from 'in-alerting/smart-alerts/websites/Alerts';
import { actionNameColumn, nameColumn } from 'in-automation/PolicyTable/columnDefinitions';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';
import usePoliciesFilterUrlState from 'in-automation/Policies/usePoliciesFilterUrlState';
import { getSubtitle as getSubtitleLog } from 'in-alerting/smart-alerts/logs/Alerts';
import { hasError, isLoading, listSuccess } from 'in-services/util/result';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import usePolicies, { refresh } from 'in-automation/Policies/usePolicies';
import { PolicyTypeFilter } from 'in-automation/PolicyTable/tableFilters';
import AutomationTabs from 'in-automation/AutomationTabs/AutomationTabs';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import { TagsFilter } from 'in-automation/components/tableFilters';
import WithSubscript from 'in-settings/components/WithSubscript';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import { all as allProgress } from 'in-hooks/utils/progress';
import { close } from 'in-components/DialogPresenter/store';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { deletePolicy } from 'in-automation/api';
import useTriggers from './useTriggers';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

import locals from './Policies.mless';

const pathSegment = '/policies';
const matrixPrefix = '';

type PolicyTableEntity = Policy & { trigger: TriggerSpecification | undefined };

export default function Policies() {
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

  const [[policies, policyStatus, policiesErrors, policiesProgress], availableTags] = usePolicies({
    serverTableUrlState,
    setServerTableUrlState,
    tags,
    type
  });

  const [history, historyStatus, historyErrors, historyProgress] = useActionHistory();

  const triggers = useTriggers();
  const actualPage = policies?.page ?? page;
  const actualPageSize = policies?.pageSize ?? pageSize;

  const progress = allProgress(policiesProgress, historyProgress);
  const status = allStatus(policyStatus, historyStatus);
  const errors = [...policiesErrors, ...historyErrors];

  const navigateToPolicyDetails = useNavigateToPolicyDetails();
  const result: PaginatedResult<PolicyTableEntity> | undefined =
    status === 'resolved'
      ? {
          ...policies!,
          items: policies!.items?.map(policy => {
            const historyItem = history?.items?.find(item => (item as any).policyId === policy.id);
            const triggerType = policy.trigger.type;
            const triggerItem = isLoading(triggers[triggerType])
              ? null
              : hasError(triggers[triggerType])
              ? policy.trigger
              : // @ts-expect-error
                triggers?.[triggerType]?.data?.find(trigger => trigger.id === policy.trigger.id);
            return {
              ...policy,
              history: historyItem,
              trigger: triggerItem
            };
          })
        }
      : undefined;
  const totalHits = result?.totalHits;

  return (
    <AutomationTabs>
      <ServerTablePresenter<PolicyTableEntity, ServerTablePresenterProps<PolicyTableEntity>>
        onChange={setServerTableUrlState}
        pageSize={actualPageSize}
        page={actualPage}
        searchPlaceholder={t('in-automation:policies.searchPolicies')}
        searchMaxWidth={180}
        onRowClick={item => navigateToPolicyDetails(item.id, false)}
        cardTitle={
          policiesProgress.loading
            ? t('in-automation:policies.policies')
            : t('in-automation:policies.policiesWithCount', { count: totalHits })
        }
        rightHeader={
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
        }
        orderBy={orderBy}
        orderDirection={orderDirection}
        query={query}
        result={{
          progress,
          errors,
          data: result
        }}
        columnDefinitions={columnDefinition}
        noDataMessage={t('in-automation:policies.noPolicies')}
        fixedLayout
      />
    </AutomationTabs>
  );
}

export function EventNameWithoutTriggerInfo({ entity }: { entity: Trigger }) {
  const { name } = entity;

  return (
    <Tooltip content={name} align="topLeft" delay={500}>
      <WithSubscript subscript={entity.type === 'builtinEvent' ? 'Built-in' : ''}>
        <span className={locals.ellipsis}>{name}</span>
      </WithSubscript>
    </Tooltip>
  );
}

const columnDefinition: ColumnDefinition<PolicyTableEntity>[] = [
  nameColumn,
  {
    id: 'trigger',
    label: t('in-automation:policies.eventTrigger'),
    getContent: item => {
      if (isEventSpecification(item.trigger)) {
        // return <EventName hasRowNavigation={false} entity={item.trigger} />;
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
          <NameColumnCell
            config={item.trigger}
            getSubtitle={config => getSubtitleWebsite(config.rule, config.threshold)}
          />
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
            getSubtitle={config => getSubtitleInfra(config.rule, config.threshold, config.predictiveTrigger)}
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
      if (item.trigger) {
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
    getContent: function Content(item) {
      const navigateToPolicyDetails = useNavigateToPolicyDetails();
      if (!role?.canConfigureAutomationPolicies) return null;
      return (
        <Stack align="end">
          <MoreMenu kind="subtle">
            <MoreMenuButton icon="lib_actions_edit" onClick={() => navigateToPolicyDetails(item.id, false)}>
              {t('in-automation:edit')}
            </MoreMenuButton>
            <MoreMenuButton icon="lib_actions_copy" onClick={() => navigateToPolicyDetails(item.id, true)}>
              {t('in-automation:copy')}
            </MoreMenuButton>
            <MoreMenuButton icon="lib_actions_delete" onClick={() => showConfirmationDialog(item)}>
              {t('in-automation:delete')}
            </MoreMenuButton>
          </MoreMenu>
        </Stack>
      );
    }
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

function useActionHistory() {
  return resultToFetchedStateResponse(listSuccess<ActionInstance>([]));
}
