/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { RouteComponentProps } from 'react-router';
import { MapForm } from 'formalistic';
import React from 'react';

import { createActionFormDefinition } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import ActionForm from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { NewAction, saveAction, saveNewAction } from 'in-api/automation';
import { teamSettingsActionCatalog } from 'in-settings/navigation/paths';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
// @ts-expect-error
import entityForm from 'in-hoc/entityForm';
import SectionLine from 'in-settings/components/SectionLine';
import { getAction, createAction } from 'in-api/automation';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface MatchParams {
  id: string;
}

export default function Action(props: RouteComponentProps<MatchParams>) {
  const entityId = props.match.params.id;

  return (
    <Form
      title={t('in-settings:tabs.action')}
      entityId={entityId}
      createDefaultEntity={createAction}
      createForm={(action: NewAction) => createActionFormDefinition(action, !entityId)}
      getEntityFromApi={getAction}
      openEntities={() => goToPath(teamSettingsActionCatalog)}
      saveEntity={(action: NewAction, form: any) => save(action, form, entityId)}
    />
  );
}

const Form = entityForm(function ActionFormWrapper(props: any) {
  const { entity, form, isCreate, saveEnabled, loading, error, message } = props;

  if (loading) {
    return <LoadingIndicator size={'xl'} />;
  }

  if (error) {
    return (
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

function save(action: NewAction, form: MapForm, id: string) {
  const actionSpecification = getActionSpecification(form);
  console.log(action, form, id);
  const isCreate = !id;
  if(isCreate) {
    return saveNewAction(actionSpecification);
  } else {
    return saveAction(actionSpecification, id);
  }
}

function getActionSpecification(form: MapForm): NewAction  {
  const name = form?.get('name')?.toJS();
  const description = form?.get('description')?.toJS();
  const fields = form?.get('fields')?.toJS();
  const type = form?.get('type')?.toJS();
  const tags = form?.get('tags')?.toJS();
  return {
    name,
    description,
    fields,
    type,
    tags
  };
}
