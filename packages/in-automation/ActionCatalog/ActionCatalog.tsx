/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button, Spacer, Stack, Typography } from '@instana/components';
import { Action, Error, Result } from '@instana/types';

import {
  createTagsUrlParameter,
  createTypeUrlParameter,
  createTabTypeUrlParameter
} from 'in-automation/navigation/urlParameters';
import GenerateAIScriptActionDialog from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/GenerateAIScriptActionDialog';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getDocLinkFromFields, getManualContentFromFields, base64ToUtf8 } from 'in-automation/utils/actionField';
import { descriptionColumn, lastModifiedColumn, nameColumn } from 'in-automation/ActionTable/columnDefinitions';
import useActionCatalogFilterUrlState from 'in-automation/ActionCatalog/useActionCatalogFilterUrlState';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import useNavigateToActionDetails from 'in-automation/navigation/hooks/useNavigateToActionDetails';
import { refresh, usePaginatedActions } from 'in-automation/ActionCatalog/useActions';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import CreateNewAction1 from 'in-automation/ActionCatalog/CreateNewAction1';
import RunActionDialog from 'in-automation/RunActionDialog/RunActionDialog';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { TypeFilter } from 'in-automation/ActionTable/tableFilters';
import { TagsFilter } from 'in-automation/components/tableFilters';
import MoreMenuButton from 'in-components/MoreMenu/MoreMenuButton';
import { isNotEditable } from 'in-automation/utils/action';
import { useSegmentTracker } from 'in-automation/tracker';
import MoreMenu from 'in-components/MoreMenu/MoreMenu';
import { ACTION_TYPE } from 'in-automation/constants';
import { isLoading } from 'in-services/util/result';
import { deleteAction } from 'in-automation/api';
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

  const [{ tags, types }, setFilter] = useActionCatalogFilterUrlState({ pathSegment, matrixPrefix });
  const paginatedActions = usePaginatedActions({ actions, serverTableUrlState, setServerTableUrlState, types, tags });

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
      searchMaxWidth={180}
      cardTitle={
        isLoading(paginatedActions)
          ? t('in-automation:actions')
          : t('in-automation:actionsWithCount', { count: totalHits })
      }
      rightHeader={
        <>
          {role?.canConfigureAutomationActions && isUserActions && (
            <>
              <Button kind="action" onClick={() => navigateToActionDetails()} icon="lib_openclose_add_circle_outline">
                {t('in-automation:ActionCatalog.newAction')}
              </Button>
              <Button kind="action" onClick={() => handleButtonClick({})} icon="lib_openclose_add_circle_outline">
                {/* {t('in-automation:ActionCatalog.newAction')} */}
                New action (Tear sheet)
              </Button>
            </>
          )}
          <>
            <Spacer horizontal="small" />
            <Stack direction="horizontal">
              <TypeFilter
                type={types ?? undefined} // Ensure `types` can be `string[]` or `null`
                setType={params => setFilter({ types: params.types?.length ? params.types : undefined })} // Handle `types` correctly
              />

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

function ActionCatalogMoreMenu({ action, isUserActions }: { action: Action; isUserActions: boolean }) {
  const hasAccessToScript = useHasAccessToScript();
  const { generateAIButtonClickTrackerSegment } = useSegmentTracker();
  const hasPermisson = role?.canConfigureAutomationActions || role?.canRunAutomationActions;
  let manualContent = '';

  if (action.type === ACTION_TYPE.MANUAL) {
    const content = getManualContentFromFields(action.fields);
    if (content.encoding === 'base64') {
      manualContent = base64ToUtf8(content.value);
    }
  }
  if (!hasPermisson) return null;
  return (
    <Stack align="end">
      <MoreMenu kind="subtle">
        {role?.canRunAutomationActions && action.type !== ACTION_TYPE.MANUAL && (
          <MoreMenuButton
            icon="lib_actions_play"
            onClick={() => {
              if (action.type === ACTION_TYPE.DOC_LINK) {
                window.open(getDocLinkFromFields(action.fields).value, '_blank')?.focus();
              } else {
                addActiveDialog(<RunActionDialog test action={action} volatileId={{}} />);
              }
            }}
          >
            {t('in-automation:test')}
          </MoreMenuButton>
        )}
        {role?.canConfigureAutomationActions && (
          <>
            {isUserActions && (
              <MoreMenuButton icon="lib_actions_edit " onClick={() => handleButtonClick({ actionId: action?.id })}>
                {t('in-automation:edit')}
              </MoreMenuButton>
            )}
            <MoreMenuButton
              disabled={action.type === ACTION_TYPE.ANSIBLE}
              icon="lib_actions_copy"
              onClick={() => handleButtonClick({ actionId: action?.id, copy: true })}
            >
              {t('in-automation:copy')}
            </MoreMenuButton>
            {action.type === ACTION_TYPE.MANUAL && (
              <MoreMenuButton
                icon="lib_launch_ai"
                onClick={() => {
                  generateAIButtonClickTrackerSegment({
                    type: 'script',
                    location: 'action catalog',
                    actionName: action.name,
                    actionId: action?.id
                  });
                  addActiveDialog(
                    <GenerateAIScriptActionDialog manualContent={manualContent} actionName={action.name} />
                  );
                }}
              >
                {t('in-automation:GenerateAIActionDialog.generateScriptDialog.generateScriptButton')}
              </MoreMenuButton>
            )}
            {isUserActions && (
              <MoreMenuButton
                disabled={isNotEditable(action, false) && action.type !== ACTION_TYPE.ANSIBLE}
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
    getContent: action => <ActionCatalogMoreMenu action={action} isUserActions={isUserActions} />
  }
];

function showConfirmationDialog(action: Action) {
  const { id, name } = action;
  addActiveDialog(
    <ConfirmationDialog
      header={t('in-automation:deleteDialog.confirmRemove')}
      description={
        <Typography variant="body-regular">
          <Trans i18nKey="in-automation:deleteDialog.confirmRemoveMsg" values={{ name }} />
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

const handleButtonClick = ({ actionId, copy }: { actionId?: string; copy?: boolean }) => {
  addActiveDialog(<CreateNewAction1 actionId={actionId} copy={copy} />);
};
