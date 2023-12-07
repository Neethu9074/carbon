/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { Button, Typography } from '@instana/components';
import { SvgIcon } from '@instana/components';
import { Spacer } from '@instana/components';

import {
  isDocLink,
  isScript,
  isWebhook,
  getDocLinkFromFields,
  isAnsible,
  getType
} from 'in-automation/ActionCatalog/shared';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { createTagsUrlParameter, createTriggerUrlParameter } from 'in-automation/navigation/urlParameters';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { resultToFetchedStateResponse } from 'in-hooks/utils/resultToFetchedStateResponse';
import { isAutomatic, isManual, TriggerSpecification } from 'in-automation/Policies/types';
import { ActionInstance, PaginatedResult, Policy, VolatileId, Event } from 'in-types';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import usePolicies from 'in-automation/AssociatedActions/usePolicies';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import WithSubscript from 'in-settings/components/WithSubscript';
import { all as allStatus } from 'in-hooks/utils/fetchStatus';
import { all as allProgress } from 'in-hooks/utils/progress';
import { close } from 'in-components/DialogPresenter/store';
import { runActionTracker } from 'in-automation/tracker';
import { listSuccess } from 'in-services/util/result';
import Tooltip from 'in-components/Tooltip/Tooltip';
import { Title } from 'in-components/Dialog/Header';
import Tag from 'in-automation/ActionCatalog/Tag';
import { deletePolicy } from 'in-automation/api';
import { role } from 'in-stores/user';
import { useTheme } from 'in-themes';
import { Trans, t } from 'in-i18n';

import locals from './Policies.mless';

const pathSegment = '/policies';
const matrixPrefix = '';
type PolicyTableEntity = Policy & { history: ActionInstance | undefined; trigger: TriggerSpecification | undefined };
interface PoliciesProps {
  title?: string;
  event?: Event;
  volatileId: VolatileId;
  triggerDetails: { triggerId: string; triggerType: any };
  rightHeader?: ReactNode;
  triggerReload: () => void;
}
export default function Policies({
  title,
  triggerDetails,
  rightHeader,
  event,
  volatileId,
  triggerReload
}: PoliciesProps) {
  const theme = useTheme();
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

  const [[policies, policyStatus, policiesErrors, policiesProgress]] = usePolicies({
    page,
    pageSize,
    orderBy,
    orderDirection,
    query,
    triggerDetails
  });

  const [history, historyStatus, historyErrors, historyProgress] = useActionHistory();

  const actualPage = policies?.page ?? page;
  const actualPageSize = policies?.pageSize ?? 7;

  const progress = allProgress(policiesProgress, historyProgress);
  const status = allStatus(policyStatus, historyStatus);
  const errors = [...policiesErrors, ...historyErrors];
  // @ts-expect-error
  const result: PaginatedResult<PolicyTableEntity> | undefined =
    status === 'resolved'
      ? {
          ...policies!,
          items: policies!.items?.map(policy => {
            // TODO: This is a hack to get the history item for a policy. We need to change the API to return the history
            const historyItem = history?.items?.find(item => (item as any).policyId === policy.id);
            return {
              ...policy,
              history: historyItem
            };
          })
        }
      : undefined;

  const deleteColumn = (triggerReload: () => void) => ({
    label: '',
    id: 'actions',
    sortable: false,
    width: 5,
    getContent: function Content(item: Policy) {
      return (
        <div>
          <Tooltip content={t('in-automation:deletePolicyWithName', { actionName: item.name })}>
            <SvgIcon
              color={theme.ids.color.option.blue['400']}
              type="lib_actions_delete"
              onClick={() => showConfirmationDialog(item, triggerReload)}
            />
          </Tooltip>
        </div>
      );
    }
  });

  let columnDefinitionsToShow = [...columnDefinition, deleteColumn(triggerReload)];
  if (role?.canRunAutomationActions) {
    columnDefinitionsToShow = [...columnDefinition, executeColumn(volatileId, event), deleteColumn(triggerReload)];
  }
  return (
    <div>
      <Spacer vertical="normal" />
      <Title title={title ?? t('in-automation:policies.policies')} />
      <ServerTablePresenter<PolicyTableEntity, ServerTablePresenterProps<PolicyTableEntity>>
        onChange={setServerTableState}
        pageSize={actualPageSize}
        page={actualPage}
        searchPlaceholder={t('in-automation:policies.searchPolicies')}
        rightHeader={rightHeader}
        orderBy={orderBy}
        orderDirection={orderDirection}
        query={query}
        result={{
          progress,
          errors,
          data: result
        }}
        columnDefinitions={columnDefinitionsToShow}
      />
    </div>
  );
}

export function Subscript({ policy }: { policy: PolicyTableEntity }) {
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
    width: 23,
    sortable: true,
    getContent: item => (
      <WithSubscript subscript={<Subscript policy={item} />}>
        <Tooltip content={item.name} delay={500}>
          <span
            className={classNames({
              [locals.block]: true,
              [locals.ellipsis]: item.name.length > 60
            })}
          >
            {item.name}
          </span>
        </Tooltip>
      </WithSubscript>
    )
  },
  {
    id: 'actionName',
    label: t('in-automation:policies.actionName'),
    getContent: item => (
      <Typography variant="body-regular">
        {item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.name}
      </Typography>
    ),
    width: 23,
    sortable: true
  },
  {
    id: 'type',
    label: t('in-automation:actionType'),
    width: 20,
    getContent: item => getType(item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action.type)
  },
  {
    label: t('in-automation:tags'),
    id: 'tags',
    width: 20,
    getContent(item) {
      const { tags = [] } = item;
      return (
        <>
          {tags.map((tag, idx) => (
            <Tag key={tag + idx} tag={tag} />
          ))}
        </>
      );
    }
  }
];

function showConfirmationDialog(policy: Policy, triggerReload: () => void) {
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
        onDelete(id!, triggerReload);
      }}
    />
  );
}

function onDelete(id: string, triggerReload: () => void) {
  deletePolicy(id).once(
    () => {
      onDeleteSuccess();
      triggerReload();
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

const executeColumn = (volatileId: VolatileId, event?: Event) => ({
  id: 'execute',
  width: 9,
  label: t('in-automation:ActionCatalog.execute'),
  getContent: function Content(item: Policy) {
    const action = item.typeConfigurations[0]?.runnable.runConfiguration.actions[0].action;
    const { type, fields } = action;
    if (isDocLink(type) && isManual(item)) {
      const value = getDocLinkFromFields(fields).value;
      return (
        <Button
          kind="action"
          icon={'lib_views_external_link'}
          target="_blank"
          href={value}
          onClick={() => {
            runActionTracker({
              actionType: action.type,
              actionName: action.name,
              policyId: item.id,
              policyName: item.name
            });
          }}
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.launch')}
        </Button>
      );
    } else if (isManual(item) && (isScript(type) || isWebhook(type) || isAnsible(type))) {
      return (
        <Button
          kind="action"
          icon={'lib_actions_play'}
          onClick={() =>
            addActiveDialog(
              <RunActionDialog action={action} executePolicy={item} volatileId={volatileId} event={event} />
            )
          }
          noAutoMargin
        >
          {t('in-automation:ActionCatalog.run')}
        </Button>
      );
    } else {
      return <div />;
    }
  }
});
