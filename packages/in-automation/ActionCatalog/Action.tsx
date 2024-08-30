/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field as FormField } from 'formalistic';
import React, { createContext } from 'react';

import { themes } from '@instana/design-tokens';

import {
  AdditionalHeaders,
  Authen,
  TicketTypes,
  createDocLinkField,
  createScriptFields,
  createManualField,
  createWebhookFields,
  NewAction,
  saveAction,
  saveNewAction,
  getAction,
  createAction,
  createGithubFields,
  createGitlabFields,
  createJiraFields,
  ScoredAction
} from 'in-automation/api';
import {
  API_KEY,
  BASIC_AUTH,
  BEARER_TOKEN,
  isAnsible,
  isDocLink,
  isNotEditable,
  isScript,
  isWebhook,
  isGithub,
  isGitlab,
  isJira,
  NO_AUTH,
  OPEN,
  CLOSE,
  ADD_COMMENT,
  isManual,
  isAIAction,
  isAIActionCopy
} from 'in-automation/ActionCatalog/shared';
import {
  createActionTracker,
  editActionTracker,
  copyAIGenaratedActionTracker,
  useSegmentTracker,
  TrackingFunction
} from 'in-automation/tracker';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import useNavigateToActionCatalog from 'in-automation/navigation/hooks/useNavigateToActionCatalog';
import { createActionFormDefinition } from 'in-automation/ActionCatalog/ActionFormDefinition';
import { actionDetailsUrlParameters } from 'in-automation/navigation/urlParameters';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { Header } from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { setViewTrackingDataValues } from 'in-components/ViewTrackingMeta';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import { productAreas } from 'in-services/tracking/productAreas';
import ActionForm from 'in-automation/ActionCatalog/ActionForm';
import { Label } from 'in-automation/ActionCatalog/FieldsTable';
import SectionLine from 'in-settings/components/SectionLine';
import useEntityForm from 'in-settings/hooks/useEntityForm';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import { pageNames } from 'in-services/tracking/pageNames';
import Section from 'in-settings/components/Section';
import { Action, ActionType, Field } from 'in-types';
import useUrlState from 'in-hooks/useUrlState';
import Title from 'in-components/Title/Title';
import CopyActionLink from './CopyActionLink';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Action.mless';

export const isNotEditableContext = createContext(false);

export type ActionFormEntity = NewAction | Action | ScoredAction;

const isAction = (action: NewAction | Action): action is Action => (action as Action).id !== undefined;

function useActionDetailsUrlParams() {
  const [{ id, op }] = useUrlState<{ id?: string; op: 'copy' | null }>({
    bind: [actionDetailsUrlParameters.id, actionDetailsUrlParameters.op]
  });
  const isCopy = op === 'copy';
  const isCreate = !id;
  const isNew = isCreate || isCopy;
  return {
    id: id ?? null,
    isNew,
    isCreate,
    isCopy
  };
}

export default function ActionDetailsWrapper() {
  const { id, isNew, isCreate, isCopy } = useActionDetailsUrlParams();
  return <ActionDetails key={String(isCopy)} id={id} isNew={isNew} isCreate={isCreate} isCopy={isCopy} />;
}

interface ActionDetailsProps {
  id: string | null;
  isNew: boolean;
  isCreate: boolean;
  isCopy: boolean;
}

function ActionDetails({ id, isNew, isCreate, isCopy }: ActionDetailsProps) {
  const navigateToActionCatalog = useNavigateToActionCatalog();
  const { createActionTrackerSegment, editActionTrackerSegment } = useSegmentTracker();
  const entityFormParam = {
    entityId: id,
    createDefaultEntity: createAction,
    createForm: (action: ActionFormEntity) => createActionFormDefinition(action),
    getEntityFromApi: (actionId: string) =>
      getAction(actionId).map(action =>
        isCopy ? { ...action, name: t('in-automation:copyOf', { name: action.name }) } : action
      ),
    saveEntity: (entity: ActionFormEntity, form: MapForm<any>) =>
      save(form, id, isNew, entity, isCopy, createActionTrackerSegment, editActionTrackerSegment),
    openEntities: () => navigateToActionCatalog()
  };
  const { entity, form, saveEnabled, loading, error, message, onSubmit, setForm, onChange } =
    useEntityForm<ActionFormEntity>(entityFormParam);
  let content: JSX.Element;
  const errorLoading = error && !entity;
  if (loading) {
    content = <LoadingIndicator size={'xl'} />;
  } else if (errorLoading) {
    content = (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={themes.default.ids.color.option.yellow['500']}>
          {t('in-automation:ActionCatalog.unknownAction')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {message}
          <br />
          {t('in-automation:ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  } else {
    const isBuiltinAction = entity?.metadata?.builtIn ?? false;
    const canSaveAction = (isBuiltinAction && isCopy) || !isBuiltinAction;
    content = (
      <div className={locals.actionBody}>
        <SettingsDetailPage>
          <ActionFormHeader isNew={isNew} entity={entity} />
          <SectionLine />

          {message ? (
            <Section>
              <Notification failure={error}>{message}</Notification>
            </Section>
          ) : null}

          <ActionForm isCreate={isCreate} form={form!} onChange={onChange} entity={entity!} setForm={setForm} />

          <SaveCancel
            form={form!}
            message={message}
            loading={loading}
            saveEnabled={saveEnabled}
            isCreate={isNew}
            hasSaveButton={role?.canConfigureAutomationActions && canSaveAction}
            onClickCancelButton={() => {
              const view = isAIAction(entity!) ? 'ai' : 'user';
              navigateToActionCatalog(view);
            }}
          />
        </SettingsDetailPage>
      </div>
    );
  }

  return (
    <isNotEditableContext.Provider value={!entity ? true : isNotEditable(entity, isCopy)}>
      <Title title={t('in-automation:ActionCatalog.action')} />
      <form onSubmit={onSubmit}>{content}</form>
    </isNotEditableContext.Provider>
  );
}

interface ActionFormHeaderProps {
  isNew: boolean;
  entity: ActionFormEntity | null;
}
const ActionFormHeader = ({ isNew, entity }: ActionFormHeaderProps) => {
  return (
    <HorizontalFlexWrapper className={locals.spaceBetween}>
      <SubViewHeader>
        {isNew
          ? t('in-automation:ActionCatalog.createANewAction')
          : t('in-automation:ActionCatalog.configureActionEntityName', { entityName: entity!.name })}
      </SubViewHeader>
      {!isNew && (
        <HorizontalFlexWrapper>
          {entity && isAction(entity) && role?.canConfigureAutomationActions && <CopyActionLink action={entity} />}
        </HorizontalFlexWrapper>
      )}
    </HorizontalFlexWrapper>
  );
};

// TODO: Check built in
function save(
  form: MapForm<any>,
  id: string | null,
  isNew: boolean,
  entity: ActionFormEntity | null,
  isCopy: boolean,
  createActionTrackerSegment: TrackingFunction,
  editActionTrackerSegment: TrackingFunction
) {
  // Set values for tracking data
  setViewTrackingDataValues(productAreas.automation, pageNames.automation_action_catalog);

  const actionSpecification = getActionSpecification(form, entity);
  if (isNew) {
    createActionTrackerSegment({
      actionName: actionSpecification.name,
      actionType: actionSpecification.type,
      aiOriginated: isAIAction(entity!) || isAIActionCopy(entity!) ? true : false
    });

    createActionTracker({
      actionType: actionSpecification.type,
      actionName: actionSpecification.name
    });
    // we also want to add aiOriginated: true true to ai generated copy actions chidren and grand chidren too.
    if ((isAIAction(entity!) || isAIActionCopy(entity!)) && isCopy) {
      copyAIGenaratedActionTracker({
        actionType: actionSpecification.type,
        actionName: actionSpecification.name,
        copiedFromRecommendationCard: false
      });
      // add aiOriginated flag to indicates that these are copied from OOTB AI action.
      const updatedCopiedAIAction = {
        metadata: { readOnly: false, builtIn: false, sensorImported: false, aiOriginated: true },
        ...actionSpecification
      };
      return saveNewAction(updatedCopiedAIAction);
    }
    return saveNewAction(actionSpecification);
  } else {
    editActionTrackerSegment({
      actionName: actionSpecification.name,
      actionType: actionSpecification.type,
      aiOriginated: isAIAction(entity!) || isAIActionCopy(entity!) ? true : false
    });

    editActionTracker({
      actionType: actionSpecification.type,
      actionName: actionSpecification.name
    });
    return saveAction(actionSpecification, id!);
  }
}

function getActionSpecification(form: MapForm<any>, entity: ActionFormEntity | null): NewAction {
  const name = (form.get('name') as FormField<string>).value;
  const description = (form.get('description') as FormField<string>).value;
  const type = (form.get('type') as FormField<ActionType>).value;
  const tags = (form.get('tags') as FormField<string[]>).value;
  const parameters = (form.get('parameters') as FormField<MappedParameter[]>).value;
  const timeout = (form.get('timeout') as FormField<string>).value;
  const fields: Field[] = [];
  if (isDocLink(type)) {
    const docLink = (form.get('docLink') as FormField<string>).value;
    fields.push(createDocLinkField(docLink));
  } else if (isManual(type)) {
    const content = (form.get('manualContent') as FormField<string>).value;
    fields.push(createManualField(content));
  } else if (isScript(type)) {
    const value = (form.get('script') as FormField<string>).value;
    const subtype = (form.get('subtype') as FormField<string>).value;
    fields.push(...createScriptFields({ value, subtype, timeout }));
  } else if (isGithub(type)) {
    const owner = (form.get('owner') as FormField<string>).value;
    const repo = (form.get('repo') as FormField<string>).value;
    const ticketActionType = (form.get('ticketActionType') as FormField<string>).value;
    let type: TicketTypes | null = null;
    if (ticketActionType === OPEN) {
      const title = (form.get('title') as FormField<string>).value;
      const body = (form.get('body') as FormField<string>).value;
      const labels = (form.get('labels') as FormField<any>).value;
      const assignees = (form.get('assignees') as FormField<any>).value;
      const labelsString = labels.map((label: Label) => label.value).join(',');
      const assigneesString = assignees.map((assignee: Label) => assignee.value).join(',');
      type = {
        type: 'open',
        title,
        body,
        labels: labelsString,
        assignees: assigneesString
      };
    } else if (ticketActionType === CLOSE) {
      const comment = (form.get('comment') as FormField<string>).value;
      type = {
        type: 'close',
        comment
      };
    } else if (ticketActionType === ADD_COMMENT) {
      const comment = (form.get('comment') as FormField<string>).value;
      type = {
        type: 'add_comment',
        comment
      };
    }
    fields.push(...createGithubFields({ owner: owner, repo: repo, ticketActionType: type }));
  } else if (isGitlab(type)) {
    const projectId = (form.get('projectId') as FormField<string>).value;
    const ticketActionType = (form.get('ticketActionType') as FormField<string>).value;
    let type: TicketTypes | null = null;
    if (ticketActionType === OPEN) {
      const title = (form.get('title') as FormField<string>).value;
      const body = (form.get('body') as FormField<string>).value;
      const labels = (form.get('labels') as FormField<any>).value;
      const issue_type = (form.get('issue_type') as FormField<any>).value;
      const labelsString = labels.map((label: Label) => label.value).join(',');
      type = {
        type: 'open',
        title,
        body,
        labels: labelsString,
        issue_type
      };
    } else if (ticketActionType === CLOSE) {
      const comment = (form.get('comment') as FormField<string>).value;
      type = {
        type: 'close',
        comment
      };
    } else if (ticketActionType === ADD_COMMENT) {
      const comment = (form.get('comment') as FormField<string>).value;
      type = {
        type: 'add_comment',
        comment
      };
    }
    fields.push(...createGitlabFields({ projectId: projectId, ticketActionType: type }));
  } else if (isJira(type)) {
    const project = (form.get('project') as FormField<string>).value;
    const ticketActionType = (form.get('ticketActionType') as FormField<string>).value;
    let type: TicketTypes | null = null;
    if (ticketActionType === OPEN) {
      const summary = (form.get('summary') as FormField<string>).value;
      const body = (form.get('body') as FormField<string>).value;
      const labels = (form.get('labels') as FormField<any>).value;
      const assignee = (form.get('assignee') as FormField<string>).value;
      const issue_type = (form.get('issue_type') as FormField<any>).value;
      const labelsString = labels.map((tag: Label) => tag.value).join(',');
      type = {
        type: 'open',
        summary,
        body,
        labels: labelsString,
        assignee,
        issue_type
      };
    } else if (ticketActionType === CLOSE) {
      const comment = (form.get('comment') as FormField<string>).value;
      type = {
        type: 'close',
        comment
      };
    } else if (ticketActionType === ADD_COMMENT) {
      const comment = (form.get('comment') as FormField<string>).value;
      type = {
        type: 'add_comment',
        comment
      };
    }
    fields.push(...createJiraFields({ project: project, ticketActionType: type }));
  } else if (isWebhook(type)) {
    const host = (form.get('host') as FormField<string>).value;
    const method = (form.get('method') as FormField<string>).value;
    const accept = (form.get('accept') as FormField<string>).value;
    const acceptLanguage = (form.get('acceptLanguage') as FormField<string>).value;
    const contentType = (form.get('contentType') as FormField<string>).value;
    const additionalHeaders = (form.get('additionalHeaders') as FormField<Header[]>).value;
    const body = (form.get('body') as FormField<string>).value;
    const ignoreCertErrors = (form.get('ignoreCertErrors') as FormField<boolean>).value;
    const authType = (form.get('authType') as FormField<string>).value;
    let authen: Authen = {
      type: NO_AUTH
    };
    if (authType === BASIC_AUTH) {
      const username = (form.get('username') as FormField<string>).value;
      const password = (form.get('password') as FormField<string>).value;
      authen = {
        type: BASIC_AUTH,
        username,
        password
      };
    } else if (authType === BEARER_TOKEN) {
      const bearerToken = (form.get('bearerToken') as FormField<string>).value;
      authen = {
        type: BEARER_TOKEN,
        bearerToken
      };
    } else if (authType === API_KEY) {
      const apiKey = (form.get('apiKey') as FormField<string>).value;
      const apiKeyValue = (form.get('apiKeyValue') as FormField<string>).value;
      const apiKeyAddTo = (form.get('apiKeyAddTo') as FormField<string>).value;
      authen = {
        type: API_KEY,
        apiKey,
        apiKeyValue,
        apiKeyAddTo
      };
    }
    fields.push(
      ...createWebhookFields({
        timeout,
        host,
        method,
        accept,
        acceptLanguage,
        contentType,
        additionalHeaders: additionalHeaders.reduce(
          (headers: AdditionalHeaders, header) => ({
            ...headers,
            [header.value[0]]: header.value[1]
          }),
          {}
        ),
        body,
        authen,
        ignoreCertErrors
      })
    );
  } else if (isAnsible(type)) {
    fields.push(...(entity?.fields ?? []));
  }
  const inputParameters = isDocLink(type) ? [] : parameters.map((parameter: MappedParameter) => parameter.value);
  return {
    name,
    description,
    fields,
    type,
    tags,
    inputParameters
  };
}
