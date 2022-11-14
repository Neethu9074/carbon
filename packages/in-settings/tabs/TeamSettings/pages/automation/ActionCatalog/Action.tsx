/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field as FormField } from 'formalistic';
import { RouteComponentProps } from 'react-router';
import React from 'react';

import {
  AdditionalHeaders,
  Authen,
  createDocLinkField,
  createScriptFields,
  createWebhookFields,
  NewAction,
  saveAction,
  saveNewAction
} from 'in-api/automation';
import {
  API_KEY,
  BASIC_AUTH,
  BEARER_TOKEN,
  isDocLink,
  isScript,
  isWebhook,
  NO_AUTH
} from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import { createActionFormDefinition } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import { Header } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/AdditionalHeadersTable';
import ActionForm from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionForm';
import { Tag } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/TagsTable';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { createActionTracker, editActionTracker } from 'in-settings/tracker';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsActionCatalog } from 'in-settings/navigation/paths';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import SectionLine from 'in-settings/components/SectionLine';
import { getAction, createAction } from 'in-api/automation';
import useEntityForm from 'in-settings/hooks/useEntityForm';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import Title from 'in-components/Title/Title';
import { Action, Field } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface MatchParams {
  id: string;
}

export type ActionFormEntity = NewAction | Action;
export default function ActionEntityForm(props: RouteComponentProps<MatchParams>) {
  const id = props.match.params.id;
  const entityId = id === 'new' ? null : id;
  const entityFormParam = {
    entityId,
    createDefaultEntity: createAction,
    createForm: (action: ActionFormEntity) => createActionFormDefinition(action, !entityId),
    getEntityFromApi: getAction,
    saveEntity: (_: ActionFormEntity, form: MapForm) => save(form, entityId),
    openEntities: () => goToPath(teamSettingsActionCatalog)
  };
  const { entity, form, isCreate, saveEnabled, loading, error, message, onSubmit, setForm, onChange } = useEntityForm<
    ActionFormEntity
  >(entityFormParam);
  let content: JSX.Element;
  const errorLoading = error && !entity;
  if (loading) {
    content = <LoadingIndicator size={'xl'} />;
  } else if (errorLoading) {
    content = (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownAction')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {message}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  } else {
    content = (
      <SettingsDetailPage>
        <SubViewHeader>
          {isCreate
            ? t('in-settings:tabs.createANewAction')
            : t('in-settings:tabs.configureActionEntityName', { entityName: entity!.name })}
        </SubViewHeader>

        <SectionLine />

        {message ? (
          <Section>
            <Notification failure={error}>{message}</Notification>
          </Section>
        ) : null}

        <ActionForm form={form!} onChange={onChange} entity={entity!} setForm={setForm} />

        <SaveCancel
          form={form!}
          message={message}
          loading={loading}
          saveEnabled={saveEnabled}
          isCreate={isCreate}
          listPath={teamSettingsActionCatalog}
        />
      </SettingsDetailPage>
    );
  }
  return (
    <>
      <Title title={t('in-settings:tabs.action')} />
      <form onSubmit={onSubmit}>{content}</form>
    </>
  );
}

function save(form: MapForm, id: string | null) {
  const actionSpecification = getActionSpecification(form);
  const isCreate = !id;
  if (isCreate) {
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

function getActionSpecification(form: MapForm): NewAction {
  const name = (form.get('name') as FormField<string>).value;
  const description = (form.get('description') as FormField<string>).value;
  const type = (form.get('type') as FormField<string>).value;
  const tags = (form.get('tags') as FormField<Tag[]>).value;

  const fields: Field[] = [];

  if (isDocLink(type)) {
    const docLink = (form.get('docLink') as FormField<string>).value;
    fields.push(createDocLinkField(docLink));
  } else if (isScript(type)) {
    const scriptValue = (form.get('script') as FormField<string>).value;
    fields.push(...createScriptFields(scriptValue));
  } else if (isWebhook(type)) {
    const host = (form.get('host') as FormField<string>).value;
    const method = (form.get('method') as FormField<string>).value;
    const accept = (form.get('accept') as FormField<string>).value;
    const acceptLanguage = (form.get('acceptLanguage') as FormField<string>).value;
    const contentType = (form.get('contentType') as FormField<string>).value;
    const additionalHeaders = (form.get('additionalHeaders') as FormField<Header[]>).value;
    const body = (form.get('body') as FormField<string>).value;
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
        authen
      })
    );
  }
  return {
    name,
    description,
    fields,
    type,
    tags: tags.map((tag: Tag) => tag.value)
  };
}
