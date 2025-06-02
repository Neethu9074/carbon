/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { FormGroup, Label, RadioButton, Spacer, Typography } from '@instana/components';
import { Result, Action } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  scoredActionTagsColumn,
  scoredActionNameColumn,
  scoredActionDescriptionColumn
} from 'in-automation/ActionTable/columnDefinitions';
import { GenerateAIActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/useGenerateAIActionForm';
import ServerTablePresenter, { ServerTablePresenterProps } from 'in-components/tables/ServerTable/ServerTablePresenter';
import { setGeneratedAction } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/Steps/PromptStep';
import { getManualContentFromFields, getScriptFromFields, base64ToUtf8 } from 'in-automation/utils/actionField';
import ManualActionContent from 'in-automation/components/ManualActionContent/ManualActionContent';
import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { usePaginatedScoredActions } from 'in-automation/AutomationCard/useScoredActions';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { ACTION_TYPE } from 'in-automation/constants';
import { ScoredAction } from 'in-automation/types';
import { createStore } from 'in-stores/store';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog.mless';

const pathSegment = '/recommendedActions';
const matrixPrefix = '';

const selectedActionStore = createStore<ScoredAction | null>({
  name: 'in-automation/AutomationCard/GenerateAIActionDialog/Steps/SelectActionStep',
  initialValue: null,
  isGlobal: false
});
const selectedAction$ = selectedActionStore.observable;

const useSelectedAction = () => useObservable(selectedAction$, []) ?? null;

export const setSelectedAction = (action: ScoredAction | null) => selectedActionStore.mutateTo(action);

interface SelectActionTableProps extends ServerTablePresenterProps<ScoredAction> {
  onSelect: (action: ScoredAction) => void;
  selectedAction: ScoredAction | null;
}

const columnDefinitions: ColumnDefinition<ScoredAction, SelectActionTableProps>[] = [
  {
    id: 'select',
    label: '',
    width: 50,
    getContent(item, { onSelect, selectedAction }) {
      const action = item.entity as Action;
      const selectedOOTBAction = selectedAction?.entity as Action;
      return <RadioButton label="" checked={action.id === selectedOOTBAction?.id} onChange={() => onSelect(item)} />;
    }
  },
  scoredActionNameColumn as ColumnDefinition<ScoredAction, SelectActionTableProps>,
  scoredActionDescriptionColumn as ColumnDefinition<ScoredAction, SelectActionTableProps>,
  scoredActionTagsColumn as ColumnDefinition<ScoredAction, SelectActionTableProps>
];

function onSelect({
  item,
  setForm
}: {
  item: ScoredAction;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
}) {
  const action = item.entity as Action;
  setSelectedAction(item);
  setGeneratedAction(null);
  setForm(form => {
    let updatedForm = form
      .updateIn(['action', 'name'], item => item.setValue(`(Copy of) ${action.name}`).setTouched(true))
      .updateIn(['action', 'description'], item => item.setValue(action.description ?? '').setTouched(true))
      .updateIn(['action', 'tags'], item => item.setValue(action.tags ?? []).setTouched(true))
      .updateIn(['action', 'type'], item => item.setValue(action.type).setTouched(true));
    if (action.type === ACTION_TYPE.SCRIPT) {
      const script = getScriptFromFields(action.fields);
      let plaintextScript = script.value;
      if (script.encoding === 'base64') {
        plaintextScript = base64ToUtf8(plaintextScript);
      }

      updatedForm = updatedForm.updateIn(['action', 'script'], item => item.setValue(plaintextScript));
      updatedForm = updatedForm.updateIn(['action', 'aiGeneratedContent'], item => item.setValue(plaintextScript));
    }
    if (action.type === ACTION_TYPE.MANUAL) {
      const content = getManualContentFromFields(action.fields);
      let plaintextContent = content.value;
      if (content.encoding === 'base64') {
        plaintextContent = base64ToUtf8(plaintextContent);
      }
      updatedForm = updatedForm.updateIn(['action', 'content'], item => item.setValue(plaintextContent));
      updatedForm = updatedForm.updateIn(['action', 'aiGeneratedContent'], item => item.setValue(plaintextContent));
    }
    return updatedForm;
  });
}

export default function SelectActionStep({
  actions,
  setForm
}: {
  actions: Result<ScoredAction[]>;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
}) {
  const selectedAction = useSelectedAction();
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

  function select(action: ScoredAction) {
    onSelect({ item: action, setForm });
  }

  return (
    <Row>
      <Col lg={7}>
        <Spacer vertical="normal" />
        <Typography variant="body-regular">
          {t('in-automation:GenerateAIActionDialog.Step1HeadlineSelectAction')}
        </Typography>
        <Spacer vertical="normal" />
        <ServerTablePresenter<ScoredAction, SelectActionTableProps>
          selectedAction={selectedAction}
          onSelect={select}
          onRowClick={select}
          pageSize={pageSize}
          result={result}
          page={page}
          orderBy={orderBy}
          orderDirection={orderDirection}
          isSearchable={false}
          columnDefinitions={columnDefinitions}
          fixedLayout
        />
      </Col>
      <Col lg={5}>
        <ActionPreview />
      </Col>
    </Row>
  );
}

function ActionName({ name = '-' }) {
  return (
    <FormGroup>
      <Label>{t('in-automation:actionName')}</Label>
      <Typography variant="heading-01">{name}</Typography>
    </FormGroup>
  );
}

function ScriptSection({ action }: { action: Action }) {
  const script = getScriptFromFields(action.fields);
  let plaintextScript = script.value;
  if (script.encoding === 'base64') {
    plaintextScript = base64ToUtf8(plaintextScript);
  }
  return (
    <>
      <ActionName name={action.name} />
      <FormGroup>
        <div className={locals.header}>
          <Typography variant="heading-200" component="h2">
            {t('in-automation:GenerateAIActionDialog.generateScriptDialog.titleGeneratedCodeReadOnly')}
          </Typography>
        </div>
        <div className={locals.CodeWithAISlug}>
          <Code withExpandButton code={plaintextScript} lang={'bash'} softWrap />
        </div>
      </FormGroup>
    </>
  );
}

function EmptySection() {
  return (
    <>
      <ActionName />
      <FormGroup>
        <div className={locals.header}>
          <Typography variant="heading-200" component="h2">
            {t('in-automation:titleContentReadOnly')}
          </Typography>
        </div>
        <NoDataAvailable
          height={450}
          title={t('in-automation:GenerateAIActionDialog.noResultsYet')}
          text={t('in-automation:GenerateAIActionDialog.noDataAvailableSelectAction')}
        />
      </FormGroup>
    </>
  );
}
function ActionPreview() {
  const selectedScoredAction = useSelectedAction();
  const selectedAction = selectedScoredAction?.entity as Action;
  if (!selectedAction) return <EmptySection />;
  switch (selectedAction.type) {
    case 'SCRIPT':
      return <ScriptSection action={selectedAction} />;
    case 'MANUAL':
      return (
        <ManualActionContent
          content={getManualContentFromFields(selectedAction.fields)}
          actionName={selectedAction.name}
          withAISlug
          addCopyButton
        />
      );
    default:
      return null;
  }
}
