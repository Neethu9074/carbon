/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createMapForm, createField } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';
import { createLogger } from '@instana/logger';

// @ts-expect-error
import { addPermissionFields } from 'in-settings/tabs/TeamSettings/pages/accessControl/Permissions/permissionsForm';
import { ShowCreatedToken } from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/CreatePersonalApiToken/CreatePersonalApiToken';
import {
  getApiToken,
  saveApiToken,
  createApiToken
} from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api';
import { DialogWrapper } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/DialogWrapper';
import ApiTokenForm from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokenForm';
import { teamSettingsAccessControlApiTokens } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import { notBlankValidator } from 'in-services/validators/string';
import { apiTokenDialogEnabled } from 'in-services/featureFlags';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { close } from 'in-components/DialogPresenter/store';
import { apiTokenPermissions } from 'in-stores/permission';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { MatchParams } from './ApiTokenFormDialog';
import Dialog from 'in-components/Dialog/Dialog';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

const logger = createLogger('apiTokenConfig');

export interface FormProp {
  items?: { name?: { value?: String } };
  hierarchyValid: boolean;
  setTouched(touched: boolean, opts?: any): any;
  toJS(): ApiTokenProps;
  updateIn(path: any, updater?: any): any;
  get(path: any): any;
}

export interface ApiTokenProps {
  name: string;
  accessGrantingToken: string;
  internalId: string;
  id: string;
}

interface StateProps {
  loading: boolean;
  error: boolean;
  message: string | null;
  apiToken: ApiTokenProps | null;
  form: FormProp | null;
  createNewToken: boolean;
  showCreatedToken: boolean;
}

const initialState: StateProps = {
  loading: true,
  error: false,
  message: null,
  apiToken: null,
  form: null,
  createNewToken: false,
  showCreatedToken: false
};

const ApiToken = (props: MatchParams): any => {
  const [state, setState] = useState(initialState);
  const { goToPath } = useNavigation();

  const loadApiToken = useCallback((id: string): void => {
    setState(prevState => ({
      ...prevState,
      loading: true,
      error: false,
      message: t('in-settings:tabs.loadingApiToken'),
      form: null,
      apiToken: null
    }));

    const result$ = getApiToken(id);
    result$.once((apiToken: ApiTokenProps) => {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: false,
        message: null,
        apiToken,
        form: createForm(apiToken)
      }));
    });

    result$.errors().once(() => {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: true,
        message: t('in-settings:tabs.failedToLoadApiToken')
      }));
    });
  }, []);

  const initialize = useCallback(() => {
    if (props.match.params.id == 'new') {
      const _form = createForm();
      setState(prevState => ({
        ...prevState,
        form: _form,
        createNewToken: true,
        loading: false
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        createNewToken: false
      }));
      loadApiToken(props.match.params.id);
    }
  }, [props.match.params.id, loadApiToken]);

  useEffect(() => {
    if (apiTokenDialogEnabled) {
      initialize();
    } else {
      loadApiToken(props.match.params.id);
    }
  }, [props.match.params.id, initialize, loadApiToken]);

  const createApiTokenApi = (): any => {
    const accessGrantingToken = generateUniqueShortId();
    const saveResult$ = createApiToken({
      accessGrantingToken,
      internalId: generateUniqueShortId(),
      name: state.form?.items?.name?.value
    });
    return saveResult$;
  };

  const updateForm = (apiToken: ApiTokenProps) =>
    ['accessGrantingToken', 'name', 'internalId'].forEach(fieldName => {
      let value = apiToken[fieldName as keyof ApiTokenProps];
      state.form = state.form?.updateIn([fieldName], (field: any) => field.setValue(value).setTouched(true));
    });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!state.form?.hierarchyValid) {
      setState(prevState => ({
        ...prevState,
        form: state.form?.setTouched(true, { recurse: true })
      }));
      return;
    }

    if (apiTokenDialogEnabled) {
      if (state.createNewToken) {
        const result$ = createApiTokenApi();
        result$.once((apiToken: ApiTokenProps) => {
          updateForm(apiToken);
          setState(prevState => ({
            ...prevState,
            loading: true,
            error: false,
            apiToken: apiToken,
            message: t('in-settings:tabs.saving')
          }));
          callSaveApiToken();
        });
        result$.errors().once((error: any) => {
          logger.error(`Failed to save new API token: ${error.message}`, error);
        });
      } else {
        callSaveApiToken();
      }
    } else {
      callSaveApiToken();
    }
  };

  const callSaveApiToken = () => {
    const apiToken = state.form?.toJS();
    const result$ = saveApiToken(apiToken);
    setState(prevState => ({
      ...prevState,
      loading: true,
      error: false,
      message: t('in-settings:tabs.saving')
    }));

    result$.once(() => {
      if (apiTokenDialogEnabled) {
        if (!state.createNewToken) {
          close();
        } else {
          setState(prevState => ({
            ...prevState,
            showCreatedToken: true,
            loading: false
          }));
        }
      }
      goToPath(teamSettingsAccessControlApiTokens);
    });

    result$.errors().once((error: any) => {
      const message = t('in-settings:tabs.failedToSaveApiToken', { err: error.message });
      logger.error(message, error);
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: true,
        message
      }));
    });
  };

  const onChange = (fieldName: string, value: any) => {
    const updatedForm = state.form?.updateIn([fieldName], (field: any) => field.setValue(value).setTouched(true));
    setState(prevState => ({
      ...prevState,
      form: updatedForm
    }));
  };

  const { apiToken, form, message, loading } = state;
  const headline = t('in-settings:tabs.createdApiToken');
  const description = t('in-settings:tabs.apiTokenDescription');
  const apiTokenName = apiToken?.name;
  const accessGrantingToken = apiToken?.accessGrantingToken;

  if (!apiTokenDialogEnabled)
    return (
      <SettingsDetailPage>
        <Title title={t('in-settings:tabs.apiToken')} />

        <SubViewHeader>
          {apiToken
            ? t('in-settings:tabs.apiTokenIs', { apiTokenName: apiToken.name })
            : t('in-settings:tabs.apiToken')}
        </SubViewHeader>
        <SectionLine />

        {state.message ? (
          <Section>
            <Notification failure={state.error} loading={state.loading}>
              {state.message}
            </Notification>
          </Section>
        ) : null}

        <form onSubmit={onSubmit}>
          {form ? <ApiTokenForm form={form} onChange={onChange} /> : null}
          {form ? (
            <SaveCancel
              form={form}
              message={message}
              loading={loading}
              isCreate={false}
              listPath={teamSettingsAccessControlApiTokens}
            />
          ) : null}
        </form>
      </SettingsDetailPage>
    );

  if (apiTokenDialogEnabled && state.showCreatedToken)
    return (
      <Dialog title={headline} onClose={() => close()}>
        <ShowCreatedToken
          name={apiTokenName ? apiTokenName : ''}
          token={accessGrantingToken ? accessGrantingToken : ''}
          description={description}
          onClose={() => close()}
        />
      </Dialog>
    );

  if (apiTokenDialogEnabled)
    return (
      <DialogWrapper
        title={state.createNewToken ? t('in-settings:tabs.createNewToken') : t('in-settings:tabs.editApiToken')}
        onClickCancel={() => {
          close();
          goToPath(teamSettingsAccessControlApiTokens);
        }}
        footer={
          <>
            {form ? (
              <form onSubmit={onSubmit}>
                <FormFooter>
                  <SaveCancel
                    form={form}
                    message={message}
                    loading={loading}
                    isCreate={false}
                    listPath={teamSettingsAccessControlApiTokens}
                    onClickCancelButton={() => {
                      close();
                      goToPath(teamSettingsAccessControlApiTokens);
                    }}
                  />
                </FormFooter>
              </form>
            ) : null}
          </>
        }
      >
        <SettingsDetailPage>
          {apiToken ? (
            <>
              {' '}
              <Title title={t('in-settings:tabs.apiToken')} />
              <SubViewHeader>
                {apiToken
                  ? t('in-settings:tabs.apiTokenIs', { apiTokenName: apiToken.name })
                  : t('in-settings:tabs.apiToken')}
              </SubViewHeader>
              <SectionLine />
            </>
          ) : null}

          {state.message ? (
            <Section>
              <Notification failure={state.error} loading={state.loading}>
                {state.message}
              </Notification>
            </Section>
          ) : null}

          <form onSubmit={onSubmit}>
            {form ? <ApiTokenForm form={form} onChange={onChange} createNewToken={state.createNewToken} /> : null}
          </form>
        </SettingsDetailPage>
      </DialogWrapper>
    );
};

function createForm(apiToken?: ApiTokenProps) {
  let form: any = createMapForm()
    .put('accessGrantingToken', createField({ value: apiToken ? apiToken.accessGrantingToken : '' }))
    .put(
      'name',
      createField({
        value: apiToken ? apiToken.name : '',
        validator: notBlankValidator
      })
    );

  form = form.put('internalId', createField({ value: apiToken ? apiToken.internalId : '' }));

  return addPermissionFields(
    form,
    apiToken ? apiToken : '',
    apiTokenPermissions,
    (permission: { keyForApiTokenApi: string }) => permission.keyForApiTokenApi
  );
}

export default ApiToken;
