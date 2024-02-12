/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Spacer, Stack, Typography } from '@instana/components';

import {
  AUTOMATIC,
  MANUAL,
  TriggerSpecification,
  isApplicationSmartAlert,
  isAutomatic,
  isEventSpecification,
  isManual
} from 'in-automation/Policies/types';
// @ts-expect-error
import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { PoliciesFilterState, usePoliciesFilterUrlState } from 'in-automation/Policies/usePoliciesFilterUrlState';
import { createTagsUrlParameter, createTriggerUrlParameter } from 'in-automation/navigation/urlParameters';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { EventName } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/Events';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import useNavigateToPolicyDetails from 'in-automation/Policies/useNavigateToPolicyDetails';
import { ActionInstance, PaginatedResult, Policy, TypeConfigurationType } from 'in-types';
import ComboBox, { hasMultipleValuesSelected } from 'in-components/ComboBox/ComboBox';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import usePolicies, { refresh } from 'in-automation/Policies/usePolicies';
import AutomationTabs from 'in-automation/AutomationTabs/AutomationTabs';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import WithSubscript from 'in-settings/components/WithSubscript';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import { all as allProgress } from 'in-hooks/utils/progress';
import { close } from 'in-components/DialogPresenter/store';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { listSuccess } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { deletePolicy } from 'in-automation/api';
import useTriggers from './useTriggers';
import { Trans, t } from 'in-i18n';

import locals from './Policies.mless';
import { DynamicTagList } from 'in-components/TagsList/DynamicTagList';

const pathSegment = '/policies';
const matrixPrefix = '';

type PolicyTableEntity = Policy & { history: ActionInstance | undefined; trigger: TriggerSpecification | undefined };

export default function Policies() {
  const [{ page, pageSize, orderBy, orderDirection, query }, setServerTableState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 10,
    paginationResettingUrlParameters: [
      createTriggerUrlParameter(pathSegment, matrixPrefix),
      createTagsUrlParameter(pathSegment, matrixPrefix)
    ]
  });

  const [{ tags, trigger }, setFilter] = usePoliciesFilterUrlState({ pathSegment, matrixPrefix });

  const [[policies, policyStatus, policiesErrors, policiesProgress], availableTags] = usePolicies({
    page,
    pageSize,
    orderBy,
    orderDirection,
    query,
    tags,
    trigger
  });

  const [history, historyStatus, historyErrors, historyProgress] = useActionHistory();

  const [triggers, triggersStatus, triggersErrors, triggersProgress] = useTriggers();
  const actualPage = policies?.page ?? page;
  const actualPageSize = policies?.pageSize ?? pageSize;

  const progress = allProgress(policiesProgress, historyProgress, triggersProgress);
  const status = allStatus(policyStatus, historyStatus, triggersStatus);
  const errors = [...policiesErrors, ...historyErrors, ...triggersErrors];

  const navigateToPolicyDetails = useNavigateToPolicyDetails();
  const result: PaginatedResult<PolicyTableEntity> | undefined =
    status === 'resolved'
      ? {
          ...policies!,
          items: policies!.items?.map(policy => {
            // TODO: This is a hack to get the history item for a policy. We need to change the API to return the history
            const historyItem = history?.items?.find(item => (item as any).policyId === policy.id);
            const triggerType = policy.trigger.type;
            // @ts-expect-error
            const triggerItem = triggers?.[triggerType]?.find(trigger => trigger.id === policy.trigger.id);
            return {
              ...policy,
              history: historyItem,
              trigger: triggerItem
            };
          })
        }
      : undefined;

  return (
    <AutomationTabs>
      <ServerTablePresenter<PolicyTableEntity, ServerTablePresenterProps<PolicyTableEntity>>
        onChange={setServerTableState}
        pageSize={actualPageSize}
        page={actualPage}
        searchPlaceholder={t('in-automation:policies.searchPolicies')}
        onRowClick={item => navigateToPolicyDetails(item, false)}
        cardTitle={t('in-automation:policies.policies')}
        rightHeader={
          <>
            <CreateNewEntityButton />
            <PolicyFilters setFilter={setFilter} trigger={trigger} tags={tags} availableTags={availableTags} />
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
        fixedLayout
      />
    </AutomationTabs>
  );
}

function CreateNewEntityButton() {
  const navigateToPolicyDetails = useNavigateToPolicyDetails();
  return (
    <Button kind="action" onClick={() => navigateToPolicyDetails()} icon="lib_openclose_add_circle_outline">
      {t('in-automation:policies.newPolicy')}
    </Button>
  );
}

const options = [
  { label: t('in-automation:policies.manual'), value: MANUAL },
  { label: t('in-automation:policies.automatic'), value: AUTOMATIC }
] as const;

function PolicyFilters({
  trigger,
  tags,
  availableTags,
  setFilter
}: {
  trigger: TypeConfigurationType | undefined;
  availableTags: string[];
  tags: string[];
  setFilter: (change: Partial<PoliciesFilterState>) => void;
}) {
  return (
    <>
      <Spacer horizontal="small" />
      <Stack direction="horizontal">
        <ComboBox
          options={options}
          placeholder={t('in-automation:type')}
          value={trigger}
          onChange={newValue => {
            if (!newValue) {
              setFilter({ trigger: undefined });
            } else {
              // We aren't using a multi combo box so not handling that case
              // @ts-expect-error
              setFilter({ trigger: newValue.value });
            }
          }}
        />
        <ComboBox
          options={availableTags?.map(tag => ({ value: tag, label: tag }))}
          placeholder={t('in-automation:tags')}
          value={tags}
          onChange={newValue => {
            if (!newValue) {
              setFilter({ tags: [] });
            } else if (hasMultipleValuesSelected(newValue)) {
              setFilter({ tags: newValue.map(o => o.value) });
            } else {
              setFilter({ tags: [newValue.value] });
            }
          }}
          isMulti
        />
      </Stack>
      <Spacer horizontal="small" />
    </>
  );
}

function Subscript({ policy }: { policy: PolicyTableEntity }) {
  if (isManual(policy) && isAutomatic(policy)) {
    return <>{t('in-automation:policies.manualAutomatic')}</>;
  }
  if (isManual(policy)) {
    return <>{t('in-automation:policies.manual')}</>;
  }
  if (isAutomatic(policy)) {
    return <>{t('in-automation:policies.automatic')}</>;
  }
  return null;
}

const columnDefinition: ColumnDefinition<PolicyTableEntity>[] = [
  {
    id: 'name',
    label: t('in-automation:name'),
    getContent: item => (
      <Tooltip content={item.name} align="topLeft" delay={500}>
        <WithSubscript subscript={<Subscript policy={item} />}>
          <Typography noWrap variant="body-regular">
            {item.name}
          </Typography>
        </WithSubscript>
      </Tooltip>
    ),
    width: 23,
    sortable: true
  },

  {
    id: 'trigger',
    label: t('in-automation:policies.trigger'),
    getContent: item => {
      if (isEventSpecification(item.trigger)) {
        return <EventName hasRowNavigation={false} entity={item.trigger} />;
      }
      if (isApplicationSmartAlert(item.trigger)) {
        return (
          <div className={locals.alertName}>
            <SimpleListNameColumn config={item.trigger} />
          </div>
        );
      }
      return null;
    },
    width: 23,
    sortable: true
  },
  {
    id: 'actionName',
    label: t('in-automation:policies.actionName'),
    getContent: item => (
      <Tooltip
        content={item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.name}
        align="topLeft"
        delay={500}
      >
        <HorizontalFlexWrapper>
          <Typography noWrap variant="body-regular">
            {item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.name}
          </Typography>
        </HorizontalFlexWrapper>
      </Tooltip>
    ),
    width: 23,
    sortable: true
  },
  {
    label: t('in-automation:tags'),
    id: 'tags',
    getContent(item) {
      const { tags = [] } = item;
      return <DynamicTagList tags={tags} />;
    }
  },
  {
    label: '',
    id: 'actions',
    sortable: false,
    width: 5,
    getContent: function Content(item) {
      const navigateToPolicyDetails = useNavigateToPolicyDetails();
      return (
        <Stack align="end">
          <MoreMenu kind="subtle">
            <MoreMenuButton icon="lib_actions_edit" onClick={() => navigateToPolicyDetails(item, false)}>
              {t('in-automation:edit')}
            </MoreMenuButton>
            <MoreMenuButton icon="lib_actions_copy" onClick={() => navigateToPolicyDetails(item, true)}>
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
