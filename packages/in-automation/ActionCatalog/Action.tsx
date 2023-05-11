/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, Field as FormField } from 'formalistic';
import { RouteComponentProps } from 'react-router';
import React from 'react';

import { combineLatest } from '@instana/observables';

import {
  AdditionalHeaders,
  Authen,
  createDocLinkField,
  createScriptFields,
  createWebhookFields,
  NewAction,
  saveAction,
  saveNewAction,
  addAssociations,
  getAction,
  createAction,
  getAssociations,
  concatObservables
} from 'in-automation/api';
import {
  API_KEY,
  BASIC_AUTH,
  BEARER_TOKEN,
  isDocLink,
  isScript,
  isWebhook,
  NO_AUTH,
  selectedEventsTypes
} from 'in-automation/ActionCatalog/shared';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { createActionFormDefinition } from 'in-automation/ActionCatalog/ActionFormDefinition';
import { Action, Field, ActionAssociation, EventSpecificationInfo } from 'in-types';
import useEntityForm, { SetFormFunction } from 'in-settings/hooks/useEntityForm';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { createActionTracker, editActionTracker } from 'in-automation/tracker';
import { NewActionWithAssociations } from 'in-automation/ActionCatalog/shared';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { Header } from 'in-automation/ActionCatalog/AdditionalHeadersTable';
import TestActionButton from 'in-automation/ActionCatalog/TestActionButton';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getEventSpecificationByIds } from 'in-api/eventSpecifications';
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
import { role } from 'in-stores/user';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Action.mless';

interface MatchParams {
  id: string;
}

export type ActionFormEntity = NewAction | Action;
const isAction = (action: ActionFormEntity): action is Action => (action as Action).id !== undefined;
export default function ActionEntityForm(props: RouteComponentProps<MatchParams>) {
  const { goToPath } = useNavigation();

  const id = props.match.params.id;
  const entityId = id === 'new' ? null : id;
  const isCopy = props.match.path.split('/').at(-2) === 'copy';

  function mergeResultData() {
    const actionDetails$ = getAction(id);
    const associationsDetails$ = getAssociations(id);
    // calling Get Action and Get action associations call and combining results
    return combineLatest([actionDetails$, associationsDetails$]).map(([actionResponse, associationsResponse]) => ({
      ...(actionResponse as Action),
      applicationAlertConfigIds: (associationsResponse as ActionAssociation[])
        ?.map((action: ActionAssociation) => action?.application_alert?.id)
        .filter(function (x: string | undefined) {
          return x !== undefined;
        }),
      selectedEvents:
        (associationsResponse as ActionAssociation[])
          ?.map((action: ActionAssociation) => action.custom_event?.id)
          .concat(
            (associationsResponse as ActionAssociation[])?.map((action: ActionAssociation) => action.builtin_event_id)
          )
          .filter(function (x: string | undefined) {
            return x !== undefined;
          }) ?? []
    }));
  }

  const entityFormParam = {
    entityId,
    createDefaultEntity: createAction,
    createForm: (action: NewActionWithAssociations) => createActionFormDefinition(action, !entityId),
    getEntityFromApi: () =>
      mergeResultData().map((action: any) =>
        isCopy ? { ...action, name: t('in-automation:ActionCatalog.actionCopy', { name: action.name }) } : action
      ),
    saveEntity: (_: ActionFormEntity, form: MapForm<any>) => save(form, entityId, isCopy),
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
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-automation:ActionCatalog.unknownAction')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {message}
          <br />
          {t('in-automation:ActionCatalog.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  } else {
    content = (
      <div className={locals.actionBody}>
        <SettingsDetailPage>
          <ActionFormHeader isCreate={isCreate} isCopy={isCopy} form={form} setForm={setForm} entity={entity} />
          <SectionLine />

          {message ? (
            <Section>
              <Notification failure={error}>{message}</Notification>
            </Section>
          ) : null}

          <ActionForm
            isCreate={isCreate || isCopy}
            form={form!}
            onChange={onChange}
            entity={entity!}
            setForm={setForm}
          />

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
    <>
      <Title title={t('in-automation:ActionCatalog.action')} />
      <form onSubmit={onSubmit}>{content}</form>
    </>
  );
}

interface ActionFormHeaderProps {
  isCreate: boolean;
  isCopy: boolean;
  form: MapForm<any> | null;
  entity: ActionFormEntity | null;
  setForm: SetFormFunction;
}
const ActionFormHeader = ({ isCreate, isCopy, form, entity, setForm }: ActionFormHeaderProps) => {
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
          {form && role?.canRunAutomationActions && (
            <TestActionButton form={form} setForm={setForm} action={getActionSpecification(form)} />
          )}
          {entity && isAction(entity) && <CopyActionLink action={entity} />}
        </HorizontalFlexWrapper>
      )}
    </HorizontalFlexWrapper>
  );
};

function save(form: MapForm<any>, id: string | null, isCopy: boolean) {
  const actionSpecification = getActionSpecification(form);
  const isCreate = !id;
  if (isCreate || isCopy) {
    createActionTracker({
      actionType: actionSpecification.type,
      actionName: actionSpecification.name
    });
    return saveNewAction(actionSpecification).flatMap(action =>
      addAssociations({
        action_id: action.id,
        application_alert_ids: actionSpecification?.applicationAlertConfigIds,
        builtin_event_ids: actionSpecification?.selectedEventsTypes?.builtin_event_ids ?? [],
        custom_event_ids: actionSpecification?.selectedEventsTypes?.custom_event_ids ?? []
      })
    );
  } else {
    editActionTracker({
      actionType: actionSpecification.type,
      actionName: actionSpecification.name
    });
    // return saveAction(actionSpecification, id);

    return concatObservables(
      saveAction(actionSpecification, id),
      addAssociations({
        action_id: id,
        application_alert_ids: actionSpecification?.applicationAlertConfigIds,
        builtin_event_ids: actionSpecification?.selectedEventsTypes?.builtin_event_ids ?? [],
        custom_event_ids: actionSpecification?.selectedEventsTypes?.custom_event_ids ?? []
      })
    );
  }
}

export function getActionSpecification(form: MapForm<any>): NewActionWithAssociations {
  const name = (form.get('name') as FormField<string>).value;
  const description = (form.get('description') as FormField<string>).value;
  const type = (form.get('type') as FormField<string>).value;
  const tags = (form.get('tags') as FormField<Tag[]>).value;
  const parameters = (form.get('parameters') as FormField<MappedParameter[]>).value;
  const selectedEvents = (form.get('selectedEvents') as FormField<string[]>).value;
  const applicationAlertConfigIds = (form.get('applicationAlertConfigIds') as FormField<string[]>).value;
  const selectedEventsTypes: selectedEventsTypes = { builtin_event_ids: [], custom_event_ids: [] };
  if (selectedEvents.length > 0) {
    getEventSpecificationByIds(selectedEvents).once((data: EventSpecificationInfo[]) => {
      data.map((event: EventSpecificationInfo) => {
        if (event?.type === 'BUILT_IN') {
          selectedEventsTypes.builtin_event_ids.push(event.id);
        } else {
          selectedEventsTypes.custom_event_ids.push(event.id);
        }
      });
    });
  }

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
  }
  const inputParameters = isDocLink(type) ? [] : parameters.map((parameter: MappedParameter) => parameter.value);
  return {
    name,
    description,
    fields,
    type,
    tags: tags.map((tag: Tag) => tag.value),
    inputParameters,
    selectedEvents,
    applicationAlertConfigIds,
    selectedEventsTypes
  };
}
