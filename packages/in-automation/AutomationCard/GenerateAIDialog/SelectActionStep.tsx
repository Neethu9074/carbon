/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Typography, Spacer, DescriptionItem, RadioButton } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  createNewAIActionFormDefinition,
  SetSelectedAIAction,
  AIActionForm
} from 'in-automation/AutomationCard/GenerateAIDialog/SimpleAIDialog';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState'; // ServerTableUrlState
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getScriptFromFields, getManualContentFromFields } from 'in-automation/ActionCatalog/shared';
import { nameColumn, descriptionColumn } from 'in-automation/ActionTable/columnDefinitions';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { tagsColumn } from 'in-automation/components/columnDefinitions';
import { isScript, isManual } from 'in-automation/ActionCatalog/shared';
import { toHtml } from 'in-services/formatters/markdown';
import { ScoredAction } from 'in-automation/api';
import Code from 'in-components/Code';
import { Result } from 'in-types';

import locals from './SelectAIActionsDialogPresenter.mless';

const pathSegment = '/recommendedActions';
const matrixPrefix = '';
export default function SelectActionDialog({
  actions,
  updateForm,
  selectedAIAction,
  setSelectedAIAction
}: {
  actions: Result<ScoredAction[]>;
  updateForm: React.Dispatch<React.SetStateAction<AIActionForm>>;
  selectedAIAction: ScoredAction | null;
  setSelectedAIAction: SetSelectedAIAction;
}) {
  const [serverTableUrlState, setServerTableUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: 'score',
    defaultOrderDirection: 'DESC',
    defaultPageSize: 7
  });
  const { page, pageSize, orderBy, orderDirection } = serverTableUrlState;

  const result = usePaginatedScoredActions({
    actions: actions,
    serverTableUrlState,
    setServerTableUrlState
  });

  function onChange(item: ScoredAction) {
    setSelectedAIAction(item);
    if (item) updateForm(createNewAIActionFormDefinition(item));
  }

  const columnDefinitions: ColumnDefinition<ScoredAction>[] = [
    {
      id: 'select',
      label: '',
      width: 5,
      getContent: item => <RadioButton label="" checked={item === selectedAIAction} onChange={() => onChange(item)} />
    },
    nameColumn,
    descriptionColumn,
    tagsColumn as ColumnDefinition<ScoredAction>
  ];

  return (
    <div>
      <Spacer vertical="normal" />
      <Typography variant="body-regular">{t('in-automation:simpleAIDialog.Step1Headline')}</Typography>
      <Spacer vertical="normal" />
      <ServerTablePresenter<ScoredAction, ServerTablePresenterProps<ScoredAction>>
        onRowClick={onChange}
        pageSize={pageSize}
        result={result}
        page={page}
        orderBy={orderBy}
        orderDirection={orderDirection}
        isSearchable={false}
        columnDefinitions={columnDefinitions}
        fixedLayout
      />
      <Spacer vertical="medium" />
      {selectedAIAction && selectedAIAction.fields && (
        <>
          <Typography variant="heading-300">{selectedAIAction.name}</Typography>
          <Spacer vertical="medium" />
          {isScript(selectedAIAction.type) && <ScriptSection action={selectedAIAction} />}
          {isManual(selectedAIAction.type) && <ManualSection action={selectedAIAction} />}
        </>
      )}
    </div>
  );
}

const ManualSection = ({ action }: { action: ScoredAction }) => {
  const content = getManualContentFromFields(action.fields);
  let contentText = content.value;
  if (content.encoding === 'base64') {
    contentText = atob(contentText);
  }

  return (
    <>
      <DescriptionItem
        inComponents
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin, locals.manualContent)}
        title={t('in-automation:ActionCatalog.content')}
      >
        <Spacer vertical="normal" />
        <div className={locals.manualContentMarkdown}>
          <DangerousHtmlPresenter html={toHtml(contentText, { breaks: true })} />
        </div>
      </DescriptionItem>
    </>
  );
};

const ScriptSection = ({ action }: { action: ScoredAction }) => {
  const script = getScriptFromFields(action.fields);
  let plaintextScript = script.value;
  if (script.encoding === 'base64') {
    plaintextScript = atob(plaintextScript);
  }

  return (
    <>
      <DescriptionItem
        inComponents
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin)}
        title={t('in-automation:titleScriptContent')}
      >
        <Code withExpandButton withoutCopyButton code={plaintextScript} lang={'bash'} softWrap />
      </DescriptionItem>
    </>
  );
};
