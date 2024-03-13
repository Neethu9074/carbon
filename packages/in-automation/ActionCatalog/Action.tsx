/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field as FormField } from 'formalistic';
import { RouteComponentProps } from 'react-router';
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
  createJiraFields
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
  isManual
} from 'in-automation/ActionCatalog/shared';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { createActionFormDefinition } from 'in-automation/ActionCatalog/ActionFormDefinition';
import useEntityForm, { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { createActionTracker, editActionTracker } from 'in-automation/tracker';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { Header } from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import TestActionButton from 'in-automation/ActionCatalog/TestActionButton';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { actionCatalogPath } from 'in-automation/navigation/paths';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import ActionForm from 'in-automation/ActionCatalog/ActionForm';
import SectionLine from 'in-settings/components/SectionLine';
import { Tag } from 'in-automation/ActionCatalog/TagsTable';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import Title from 'in-components/Title/Title';
import CopyActionLink from './CopyActionLink';
import { Action, Field } from 'in-types';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './Action.mless';

interface MatchParams {
  id: string;
}

export const isNotEditableContext = createContext(false);

export type ActionFormEntity = NewAction | Action;
const isAction = (action: NewAction | Action): action is Action => (action as Action).id !== undefined;
export default function ActionEntityForm(props: RouteComponentProps<MatchParams>) {
  const { goToPath } = useNavigation();

  const id = props.match.params.id;
  const entityId = id === 'new' ? null : id;
  const isCopy = props.match.path.split('/').at(-2) === 'copy';
  const entityFormParam = {
    entityId,
    createDefaultEntity: createAction,
    createForm: (action: ActionFormEntity) => createActionFormDefinition(action),
    getEntityFromApi: (actionId: string) =>
      getAction(actionId).map(action =>
        isCopy ? { ...action, name: t('in-automation:copyOf', { name: action.name }) } : action
      ),
    saveEntity: (entity: ActionFormEntity, form: MapForm<any>) => save(form, entityId, isCopy, entity),
    openEntities: () => goToPath(actionCatalogPath)
  };
  const { entity, form, isCreate, saveEnabled, loading, error, message, onSubmit, setForm, onChange } =
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
    content = (
      <div className={locals.actionBody}>
        <SettingsDetailPage>
          <ActionFormHeader
            isCreate={isCreate}
            isCopy={isCopy}
            form={form}
            setForm={setForm}
            entity={entity}
            id={entityId}
          />
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
            isCreate={isCreate || isCopy}
            listPath={actionCatalogPath}
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
  isCreate: boolean;
  isCopy: boolean;
  form: MapForm<any> | null;
  entity: ActionFormEntity | null;
  setForm: SetFormFunction;
  id: string | null;
}
const ActionFormHeader = ({ isCreate, isCopy, form, entity, setForm, id }: ActionFormHeaderProps) => {
  const isNewAction = isCreate || isCopy;
  return (
    <HorizontalFlexWrapper className={locals.spaceBetween}>
      <SubViewHeader>
        {isNewAction
          ? t('in-automation:ActionCatalog.createANewAction')
          : t('in-automation:ActionCatalog.configureActionEntityName', { entityName: entity!.name })}
      </SubViewHeader>
      {!isNewAction && (
        <HorizontalFlexWrapper>
          {form && id !== null && role?.canRunAutomationActions && (
            <TestActionButton
              form={form}
              setForm={setForm}
              action={{
                ...getActionSpecification(form, entity),
                id: id // add id to send Action id to run action
              }}
            />
          )}
          {entity && isAction(entity) && <CopyActionLink action={entity} />}
        </HorizontalFlexWrapper>
      )}
    </HorizontalFlexWrapper>
  );
};

// TODO: Check built in
function save(form: MapForm<any>, id: string | null, isCopy: boolean, entity: ActionFormEntity | null) {
  const actionSpecification = getActionSpecification(form, entity);
  const isCreate = !id;
  if (isCreate || isCopy) {
    createActionTracker({
      actionType: actionSpecification.type,
      actionName: actionSpecification.name
    });
    return saveNewAction(actionSpecification);
  } else {
    editActionTracker({
      actionType: actionSpecification.type,
      actionName: actionSpecification.name
    });
    return saveAction(actionSpecification, id);
  }
}

function getActionSpecification(form: MapForm<any>, entity: ActionFormEntity | null): NewAction {
  const name = (form.get('name') as FormField<string>).value;
  const description = (form.get('description') as FormField<string>).value;
  const type = (form.get('type') as FormField<string>).value;
  const tags = (form.get('tags') as FormField<Tag[]>).value;
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
      const labelsString = labels.map((tag: Tag) => tag.value).join(',');
      const assigneesString = assignees.map((tag: Tag) => tag.value).join(',');
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
      const labelsString = labels.map((tag: Tag) => tag.value).join(',');
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
      const labelsString = labels.map((tag: Tag) => tag.value).join(',');
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
    tags: tags.map((tag: Tag) => tag.value),
    inputParameters
  };
}
