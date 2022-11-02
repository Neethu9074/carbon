/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { RouteComponentProps } from 'react-router';
import { MapForm, Field as FormField } from 'formalistic';
import React from 'react';

import {
  createDocLinkField,
  createScriptFields,
  createWebhookFields,
  NewAction,
  saveAction,
  saveNewAction
} from 'in-api/automation';
import { createActionFormDefinition } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import { isDocLink, isScript, isWebhook } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import ActionForm from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsActionCatalog } from 'in-settings/navigation/paths';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
// @ts-expect-error
import entityForm from 'in-hoc/entityForm';
import SectionLine from 'in-settings/components/SectionLine';
import { getAction, createAction } from 'in-api/automation';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import { ImmutableNewAction } from 'in-api/automation';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import { Field } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';
import { Header } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/AdditionalHeadersTable';

interface MatchParams {
  id: string;
}

export interface Tag {
  id: string;
  value: string;
}

export default function Action(props: RouteComponentProps<MatchParams>) {
  const id = props.match.params.id;
  const entityId = id === 'new' ? undefined : id;
  return (
    <Form
      title={t('in-settings:tabs.action')}
      entityId={entityId}
      createDefaultEntity={createAction}
      createForm={(action: ImmutableNewAction) => createActionFormDefinition(action, !entityId)}
      getEntityFromApi={getAction}
      openEntities={() => goToPath(teamSettingsActionCatalog)}
      saveEntity={(_: NewAction, form: any) => save(form, entityId)}
    />
  );
}

const Form = entityForm(function ActionFormWrapper(props: any) {
  const { entity, form, isCreate, saveEnabled, loading, error, message } = props;

  if (loading) {
    return <LoadingIndicator size={'xl'} />;
  }

  if (entity && entity.get('errors')) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownAction')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {entity.get('errors').get(0)}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  return (
    <SettingsDetailPage>
      <SubViewHeader>
        {isCreate
          ? t('in-settings:tabs.createANewAction')
          : t('in-settings:tabs.configureActionEntityName', { entityName: entity.name })}
      </SubViewHeader>

      <SectionLine />

      {message ? (
        <Section>
          <Notification failure={error} loading={loading}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <ActionForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={loading}
        saveEnabled={saveEnabled}
        isCreate={isCreate}
        listPath={teamSettingsActionCatalog}
      />
    </SettingsDetailPage>
  );
});

function save(form: MapForm, id?: string) {
  const actionSpecification = getActionSpecification(form);
  const isCreate = !id;
  if (isCreate) {
    return saveNewAction(actionSpecification);
  } else {
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
    const username = (form.get('username') as FormField<string>).value;
    const password = (form.get('password') as FormField<string>).value;
    const accept = (form.get('accept') as FormField<string>).value;
    const acceptLanguage = (form.get('acceptLanguage') as FormField<string>).value;
    const contentType = (form.get('contentType') as FormField<string>).value;
    const additionalHeaders = (form.get('additionalHeaders') as FormField<Header[]>).value;
    const body = (form.get('body') as FormField<string>).value;
    fields.push(
      ...createWebhookFields({
        host,
        method,
        username,
        password,
        accept,
        acceptLanguage,
        contentType,
        additionalHeaders,
        body
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
