/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Spacer, Stack, Typography } from '@instana/components';

import {
  viewAIGenaratedActionTracker,
  clickCopyAIGenaratedActionTracker,
  clickTestAIGenaratedActionTracker
} from 'in-automation/tracker';
import {
  createTagsUrlParameter,
  createTypeUrlParameter,
  createTabTypeUrlParameter
} from 'in-automation/navigation/urlParameters';
import {
  getDocLinkFromFields,
  isAnsible,
  isDocLink,
  isManual,
  isNotEditable
} from 'in-automation/ActionCatalog/shared';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { descriptionColumn, lastModifiedColumn, nameColumn } from 'in-automation/ActionTable/columnDefinitions';
import useActionCatalogFilterUrlState from 'in-automation/ActionCatalog/useActionCatalogFilterUrlState';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import useNavigateToActionDetails from 'in-automation/ActionCatalog/useNavigateToActionDetails';
import { refresh, usePaginatedActions } from 'in-automation/ActionCatalog/useActions';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { TagsFilter } from 'in-automation/components/tableFilters';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { deleteAction } from 'in-automation/api';
import { Action, Error, Result } from 'in-types';
import { role } from 'in-stores/user';
import { Trans, t } from 'in-i18n';

const pathSegment = '/actionCatalog';
const matrixPrefix = '';

export default function ActionCatalog({
  actions,
  actionsType
}: {
  actions: Result<Action[]>;
  actionsType: 'user' | 'ai';
}) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'name',
    defaultPageSize: 10,
    paginationResettingUrlParameters: [
      createTypeUrlParameter(pathSegment, matrixPrefix),
      createTagsUrlParameter(pathSegment, matrixPrefix),
      createTabTypeUrlParameter(pathSegment, matrixPrefix)
    ]
  });
  const isUserActions = actionsType === 'user';
  const { page, pageSize, orderBy, orderDirection, query } = serverTableUrlState;

  const [{ tags, type }, setFilter] = useActionCatalogFilterUrlState({ pathSegment, matrixPrefix });
  const paginatedActions = usePaginatedActions({ actions, serverTableUrlState, setServerTableUrlState, type, tags });

  const availableTags = [...new Set(actions?.data?.flatMap(({ tags }) => tags ?? []))];
  const totalHits = paginatedActions.data?.totalHits;

  const navigateToActionDetails = useNavigateToActionDetails();
  const columnDefinitions: ColumnDefinition<Action>[] = getColumnDefinitions({ isUserActions: isUserActions });
  return (
    <ServerTablePresenter<Action, ServerTablePresenterProps<Action>>
      onChange={setServerTableUrlState}
      pageSize={pageSize}
      page={page}
      searchPlaceholder={t('in-automation:searchActions')}
      onRowClick={item => {
        navigateToActionDetails(item, false);
        if (!isUserActions) viewAIGenaratedActionTracker({ actionName: item.name });
      }}
      cardTitle={
        paginatedActions?.progress.loading
          ? t('in-automation:actions')
          : t('in-automation:actionsWithCount', { count: totalHits })
      }
      rightHeader={
        <>
          {role?.canConfigureAutomationActions && isUserActions && (
            <Button kind="action" onClick={() => navigateToActionDetails()} icon="lib_openclose_add_circle_outline">
              {t('in-automation:ActionCatalog.newAction')}
            </Button>
          )}
          <>
            <Spacer horizontal="small" />
            <Stack direction="horizontal">
              <TypeFilter type={type ?? null} setType={type => setFilter({ type: type ?? undefined })} />
              <TagsFilter availableTags={availableTags} tags={tags} setTags={tags => setFilter({ tags })} />
            </Stack>
            <Spacer horizontal="small" />
          </>
        </>
      }
      orderBy={orderBy}
      orderDirection={orderDirection}
      query={query}
      result={paginatedActions}
      noDataMessage={t('in-automation:ActionCatalog.noActions')}
      columnDefinitions={columnDefinitions}
      fixedLayout
    />
  );
}

const getColumnDefinitions = ({ isUserActions }: { isUserActions: boolean }): ColumnDefinition<Action>[] => [
  nameColumn,
  descriptionColumn,
  lastModifiedColumn,
  tagsColumn as ColumnDefinition<Action>,
  {
    label: '',
    id: 'actions',
    sortable: false,
    width: 5,
    getContent: function Content(action) {
      const navigateToActionDetails = useNavigateToActionDetails();
      const hasPermisson = role?.canConfigureAutomationActions || role?.canRunAutomationActions;
      if (!hasPermisson) return null;
      return (
        <Stack align="end">
          <MoreMenu kind="subtle">
            {role?.canRunAutomationActions && !isManual(action.type) && (
              <MoreMenuButton
                icon="lib_actions_play"
                onClick={() => {
                  if (isDocLink(action.type)) {
                    window.open(getDocLinkFromFields(action.fields).value, '_blank')?.focus();
                  } else {
                    addActiveDialog(<RunActionDialog test action={action} volatileId={{}} />);
                  }

                  if (!isUserActions) clickTestAIGenaratedActionTracker({ actionName: action.name });
                }}
              >
                {t('in-automation:test')}
              </MoreMenuButton>
            )}
            {role?.canConfigureAutomationActions && (
              <>
                {isUserActions && (
                  <MoreMenuButton icon="lib_actions_edit" onClick={() => navigateToActionDetails(action, false)}>
                    {t('in-automation:edit')}
                  </MoreMenuButton>
                )}
                <MoreMenuButton
                  disabled={isAnsible(action.type)}
                  icon="lib_actions_copy"
                  onClick={() => {
                    navigateToActionDetails(action, true);
                    if (!isUserActions) clickCopyAIGenaratedActionTracker({ actionName: action.name });
                  }}
                >
                  {t('in-automation:copy')}
                </MoreMenuButton>
                {isUserActions && (
                  <MoreMenuButton
                    disabled={isNotEditable(action, false)}
                    icon="lib_actions_delete"
                    onClick={() => showConfirmationDialog(action)}
                  >
                    {t('in-automation:delete')}
                  </MoreMenuButton>
                )}
              </>
            )}
          </MoreMenu>
        </Stack>
      );
    }
  }
];

function showConfirmationDialog(action: Action) {
  const { id, name } = action;
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
        // TODO: Tracker for action delete
        onDelete(id);
      }}
    />
  );
}

function onDelete(id: string) {
  deleteAction(id).once(
    () => {
      onDeleteSuccess();
      refresh();
    },
    error => {
      onDeleteFailed(error);
    }
  );
}

function onDeleteSuccess() {
  addMessage(
    {
      type: 'info',
      timeout: 2000,
      content: t('in-automation:ActionCatalog.deleteDialog.success')
    },
    'action-delete-info'
  );
}

function onDeleteFailed(error: Error) {
  addMessage(
    {
      type: 'danger',
      timeout: 15000,
      content: (
        <Trans i18nKey="in-automation:ActionCatalog.deleteDialog.failure" values={{ errorMessage: error.message }} />
      )
    },
    'action-delete-error'
  );
}
