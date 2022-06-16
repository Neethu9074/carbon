/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

/* eslint-disable no-undef */

import { RouteComponentProps } from 'react-router';
import { MapForm } from 'formalistic';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { createActionFormDefinition } from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionFormDefinition';
import ActionForm from 'in-settings/tabs/TeamSettings/pages/automation/ActionCatalog/ActionForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { getType } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { NewAction, saveAction, saveNewAction } from 'in-api/automation';
import { teamSettingsActionCatalog } from 'in-settings/navigation/paths';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import DescriptionText from 'in-components/form/DescriptionText';
// @ts-expect-error
import entityForm from 'in-hoc/entityForm';
import { hasError, isLoading } from 'in-services/util/result';
import SectionLine from 'in-settings/components/SectionLine';
import { getAction, createAction } from 'in-api/automation';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import FormGroup from 'in-settings/components/FormGroup';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import Section from 'in-settings/components/Section';
import { compare } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { Action } from 'in-types';
import { Result } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

const paramCols = [
  stringColumn(t('in-settings:tabs.name'), 'name'),
  stringColumn(t('in-settings:tabs.description'), 'description', 120),
  formattedColumn(t('in-settings:tabs.value'), 'value')
];

interface MatchParams {
  id: string;
}

export function ActionComponent(props: RouteComponentProps<MatchParams>) {
  const result: Result<Action> =
    useObservable(getAction(props.match.params.id), [props.match.params.id]) ?? pendingResult;
  if (isLoading(result)) {
    return <LoadingIndicator size={'xl'} />;
  }

  if (hasError(result)) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownAction')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {result.errors[0].message}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  const { data: action } = result;

  const paramRows = action?.fields?.map(field => ({
    ...field,
    key: field.name
  }));

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.actionDetails')} />
      <SubViewHeader>{t('in-settings:tabs.actionWithName', { actionName: action?.name })}</SubViewHeader>
      <SectionLine />

      <FormGroup>
        <Label>{t('in-settings:tabs.actionType')}</Label>
        {getType(action)}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.name')}</Label>
        {action?.name}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.description')}</Label>
        {action?.description}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.fields')}</Label>
        <Table cols={paramCols} rows={paramRows} />
      </FormGroup>
      <SaveCancel
        loading={!action}
        listPath={teamSettingsActionCatalog}
        cancelButtonLabel={t('in-settings:tabs.back')}
        hasSaveButton={false}
      />
    </SettingsDetailPage>
  );
}

export default function CustomEvent(props: RouteComponentProps<MatchParams>) {
  const entityId = props.match.params.id;

  return (
    <Form
      title={t('in-settings:tabs.action')}
      entityId={entityId}
      createDefaultEntity={createAction}
      createForm={(action: NewAction) => createActionFormDefinition(action, !entityId)}
      getEntityFromApi={(id: string) => {console.log('yo'); return getAction(id).map(response => response.data);}}
      openEntities={() => goToPath(teamSettingsActionCatalog)}
      saveEntity={(action: NewAction, form: any) => save(action, form, entityId)}
    />
  );
}

const Form = entityForm(function DetailsForm(props: any) {
  const { entity, form, isCreate, saveEnabled } = props;
  let message;
  console.log(props);
  if (isLoading(entity)) {
    return <LoadingIndicator size={'xl'} />;
  }
  if (hasError(entity)) {
    message = entity.errors[0].message;
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
          <Notification failure={hasError(entity)} loading={isLoading(entity)}>
            {message}
          </Notification>
        </Section>
      ) : null}

      <ActionForm {...props} />

      <SaveCancel
        form={form}
        message={message}
        loading={isLoading(entity)}
        saveEnabled={saveEnabled}
        isCreate={isCreate}
        listPath={teamSettingsActionCatalog}
      />
    </SettingsDetailPage>
  );
});

function save(action: NewAction, form: MapForm, id: string) {
  const actionSpecification = getActionSpecification(form);
  // eslint-disable-next-line no-console
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
  return {
    name,
    description,
    fields,
    type
  };
}

type Row = Record<string, string>;

function stringColumn(title: string, attr: string, width = 80) {
  return {
    title,
    type: 'string',
    width,
    typeArgs: {
      getValue(row: Row) {
        return row[attr];
      }
    }
  };
}

function formattedColumn(title: string, attr: string) {
  return {
    title,
    type: 'link',
    width: 50,
    typeArgs: {
      comparator: compare,
      get(row: Row) {
        const value = row[attr];
        return {
          value,
          external: true,
          href: value,
          label: value
        };
      }
    }
  };
}
