/*
 * (c) Copyright IBM Corp. 2023
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createMapForm, createField, MapForm } from 'formalistic';

import { DateFormatterInput } from '@instana/format-date';
import { generateUniqueShortId } from '@instana/utils';
import { createLogger } from '@instana/logger';

// @ts-expect-error
import { addPermissionFields } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Permissions/permissionsForm';
import {
  getApiToken,
  saveApiToken,
  createApiToken
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/api';
import { ShowCreatedToken } from 'in-settings/tabs/UserSettings/pages/PersonalApiTokens/CreatePersonalApiToken/CreatePersonalApiToken';
import { MatchParams } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokenFormDialog';
import { DialogWrapper } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/DialogWrapper';
import { addFormForExpiryTimeStamp, ExpiryOptionType } from 'in-settings/components/ApiTokenExpiration/utils';
import ApiTokenForm from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokenForm';
import { SETTINGS_API_TOKEN_CREATE, SETTINGS_API_TOKEN_UPDATE } from 'in-services/tracking/eventNames';
import { securityAndAccessAccessControlApiTokens } from 'in-settings/navigation/paths';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { CREATED_OBJECT, UPDATED_OBJECT } from 'in-services/util/constants';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { apiTokenExpirationEnabled } from 'in-services/featureFlags';
import FormFooter from 'in-components/form/FormFooter/FormFooter';
import { notBlankValidator } from 'in-services/validators/string';
import { close } from 'in-components/DialogPresenter/store';
import { apiTokenPermissions } from 'in-stores/permission';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiToken.mless';

const logger = createLogger('apiTokenConfig');

export interface ApiTokenProps {
  name: string;
  accessGrantingToken: string;
  internalId: string;
  id: string;
  createdBy?: string;
  createdOn?: DateFormatterInput;
  lastUsedOn?: DateFormatterInput;
  expiresOn?: DateFormatterInput;
  expiryOption?: ExpiryOptionType;
}

export interface StateProps {
  loading: boolean;
  error: boolean;
  message: string | null;
  apiToken: ApiTokenProps | null;
  form: MapForm<any> | null | undefined;
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
  const { apiToken, form, message, loading } = state;
  const headline = t('in-settings:tabs.createdApiToken');
  const description = t('in-settings:tabs.apiTokenDescription');
  const apiTokenName = apiToken?.name;
  const accessGrantingToken = apiToken?.accessGrantingToken;
  const { unstable_trackEvent } = useSegmentTracking();

  const loadApiToken = useCallback(
    (id: string): void => {
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
        const token = props.match.params.duplicateFrom
          ? {
              ...apiToken,
              name: t('in-settings:tabs.duplicateTokenName', { apiTokenName: apiToken.name }),
              expiresOn: null
            }
          : apiToken;
        setState((prevState: any) => ({
          ...prevState,
          loading: false,
          error: false,
          message: null,
          token,
          form: createForm(token)
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
    },
    [props.match.params.duplicateFrom]
  );

  const initialize = useCallback(() => {
    if (props.match.params.id == 'new') {
      const _form = createForm();
      setState(prevState => ({
        ...prevState,
        form: _form,
        createNewToken: true,
        loading: false
      }));
    } else if (props.match.params.duplicateFrom) {
      setState(currentState => ({
        ...currentState,
        createNewToken: true
      }));
      loadApiToken(props.match.params.duplicateFrom);
    } else {
      setState(prevState => ({
        ...prevState,
        createNewToken: false
      }));
      loadApiToken(props.match.params.id);
    }
  }, [props.match.params.id, props.match.params.duplicateFrom, loadApiToken]);

  useEffect(() => {
    initialize();
  }, [props.match.params.id, initialize, loadApiToken]);

  const createApiTokenApi = (): any => {
    const accessGrantingToken = generateUniqueShortId();
    const saveResult$ = createApiToken({
      accessGrantingToken,
      internalId: generateUniqueShortId(),
      name: form?.get('name')?.value
    });
    return saveResult$;
  };

  const updateForm = (apiToken: ApiTokenProps) =>
    ['accessGrantingToken', 'name', 'internalId'].forEach(fieldName => {
      let value = apiToken[fieldName as keyof ApiTokenProps];
      state.form = state.form?.updateIn([fieldName], (field: any) => field.setValue(value).setTouched(true));
    });

  const setForm = (updatedForm: any) =>
    setState(prevState => ({
      ...prevState,
      form: updatedForm
    }));

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!state.form?.hierarchyValid) {
      setState(prevState => ({
        ...prevState,
        form: state.form?.setTouched(true, { recurse: true })
      }));
      return;
    }

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
        const customData = {
          id: apiToken?.internalId
        };
        unstable_trackEvent(CREATED_OBJECT, { objectType: SETTINGS_API_TOKEN_CREATE }, customData);
        callSaveApiToken();
      });
      result$.errors().once((error: any) => {
        logger.error(`Failed to save new API token: ${error.message}`, error);
      });
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

    result$.once(result => {
      const customData = {
        id: result?.internalId,
        expiryDate: result?.expiresOn,
        expiryOption: apiToken?.expiryOption
      };
      unstable_trackEvent(UPDATED_OBJECT, { objectType: SETTINGS_API_TOKEN_UPDATE }, customData);
      if (!state.createNewToken) {
        close();
      } else {
        setState(prevState => ({
          ...prevState,
          showCreatedToken: true,
          loading: false
        }));
      }
      goToPath(securityAndAccessAccessControlApiTokens);
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

  if (state.showCreatedToken)
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

  return (
    <DialogWrapper
      title={state.createNewToken ? t('in-settings:tabs.createNewToken') : t('in-settings:tabs.editApiToken')}
      onClickCancel={() => {
        close();
        goToPath(securityAndAccessAccessControlApiTokens);
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
                  listPath={securityAndAccessAccessControlApiTokens}
                  onClickCancelButton={() => {
                    close();
                    goToPath(securityAndAccessAccessControlApiTokens);
                  }}
                  saveEnabled={form.hierarchyValid}
                />
              </FormFooter>
            </form>
          ) : null}
        </>
      }
    >
      <SettingsDetailPage className={locals.dialogBody}>
        {state.message ? (
          <Section>
            <Notification failure={state.error} loading={state.loading}>
              {state.message}
            </Notification>
          </Section>
        ) : null}

        <form onSubmit={onSubmit}>
          {form ? (
            <ApiTokenForm
              form={form}
              onChange={onChange}
              createNewToken={state.createNewToken}
              setForm={updatedForm => setForm(updatedForm)}
            />
          ) : null}
        </form>
      </SettingsDetailPage>
    </DialogWrapper>
  );
};

export function createForm(apiToken?: ApiTokenProps) {
  let form = createMapForm()
    .put('accessGrantingToken', createField({ value: apiToken ? apiToken.accessGrantingToken : '' }))
    .put(
      'name',
      createField({
        value: apiToken ? apiToken.name : '',
        validator: notBlankValidator
      })
    )
    .put('internalId', createField({ value: apiToken ? apiToken.internalId : '' }));

  if (apiTokenExpirationEnabled) {
    const expiryOption = apiToken?.expiresOn ? 'Custom' : 'Never';

    form = form
      .put(
        'expiryOption',
        createField({
          value: expiryOption
        })
      )
      .put(
        'expiresOn',
        createField({
          value: apiToken?.expiresOn ? apiToken.expiresOn : ''
        })
      ) as MapForm<any>;
    if (expiryOption === 'Custom') {
      form = addFormForExpiryTimeStamp(form, apiToken?.expiresOn as number);
    }
  }
  return addPermissionFields(
    form,
    apiToken ? apiToken : '',
    apiTokenPermissions,
    (permission: { keyForApiTokenApi: string }) => permission.keyForApiTokenApi
  );
}

export default ApiToken;
