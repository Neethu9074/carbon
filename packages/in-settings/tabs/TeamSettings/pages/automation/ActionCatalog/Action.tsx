/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field as FormField } from 'formalistic';
import { RouteComponentProps } from 'react-router';
import React from 'react';

import { createActionFormDefinition } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import { createDocLinkField, createScriptFields, NewAction, saveAction, saveNewAction } from 'in-api/automation';
import ActionForm from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionForm';
import { isDocLink, isScript } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import useEntityForm from 'in-settings/tabs/TeamSettings/pages/automation/useEntityForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsActionCatalog } from 'in-settings/navigation/paths';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
import SectionLine from 'in-settings/components/SectionLine';
import { getAction, createAction } from 'in-api/automation';
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

export interface Tag {
  id: string;
  value: string;
}

export default function ActionEntityForm(props: RouteComponentProps<MatchParams>) {
  const id = props.match.params.id;
  const entityId = id === 'new' ? null : id;
  const entityFormParam = {
    entityId,
    createDefaultEntity: createAction,
    createForm: (action: NewAction | Action) => createActionFormDefinition(action, !entityId),
    getEntityFromApi: getAction,
    saveEntity: (_: NewAction | Action, form: MapForm) => save(form, entityId),
    openEntities: () => goToPath(teamSettingsActionCatalog)
  };
  const { entity, form, isCreate, saveEnabled, loading, error, message, onSubmit, setForm, onChange } = useEntityForm<
    NewAction | Action
  >(entityFormParam);
  let content: JSX.Element;
  if (loading) {
    content = <LoadingIndicator size={'xl'} />;
  } else if (error && !entity) {
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
  }
  return {
    name,
    description,
    fields,
    type,
    tags: tags.map((tag: Tag) => tag.value)
  };
}
