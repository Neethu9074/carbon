/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { createLogger } from '@instana/logger';
import { t } from 'in-i18n';
import React from 'react';

import { addPermissionFields } from 'in-settings/tabs/TeamSettings/pages/accessControl/Permissions/permissionsForm';
import { getApiToken, saveApiToken } from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/api';
import ApiTokenForm from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokenForm';
import { teamSettingsAccessControlApiTokens } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { apiTokenPermissions } from 'in-stores/permission';
import SaveCancel from 'in-settings/components/SaveCancel';
import Notification from 'in-components/form/Notification';
import Section from 'in-settings/components/Section';
import { goToPath } from 'in-stores/navigation';
import Title from 'in-components/Title';

const logger = createLogger('apiTokenConfig');

export default class extends React.Component {
  static displayName = 'ApiToken';

  state = {
    loading: true,
    error: false,
    message: null,
    apiToken: null,
    form: null
  };

  componentDidMount() {
    this.loadApiToken(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.loadApiToken(this.props.match.params.id);
    }
  }

  loadApiToken = id => {
    this.disposeAsyncAction();

    this.setState({
      loading: true,
      error: false,
      message: t('in-settings:tabs.loadingApiToken'),
      form: null,
      apiToken: null
    });

    const result$ = getApiToken(id);
    this.responseSubscription = result$.once(apiToken => {
      this.setState({
        loading: false,
        error: false,
        message: null,
        apiToken,
        form: createForm(apiToken)
      });
    });

    this.errorSubscription = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: t('in-settings:tabs.failedToLoadApiToken')
      });
    });
  };

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };

  render() {
    const { apiToken, form, message, loading } = this.state;

    return (
      <SettingsDetailPage>
        <Title title={t('in-settings:tabs.apiToken')} />

        <SubViewHeader>
          {apiToken
            ? t('in-settings:tabs.apiTokenIs', { apiTokenName: apiToken.name })
            : t('in-settings:tabs.apiToken')}
        </SubViewHeader>
        <SectionLine />

        {this.state.message ? (
          <Section>
            <Notification failure={this.state.error} loading={this.state.loading}>
              {this.state.message}
            </Notification>
          </Section>
        ) : null}

        <form onSubmit={this.onSubmit}>
          {form ? <ApiTokenForm form={form} onChange={this.onChange} /> : null}
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
  }

  onChange = (fieldName, value) => {
    const updatedForm = this.state.form.updateIn([fieldName], field => field.setValue(value).setTouched(true));

    this.setState({
      form: updatedForm
    });
  };

  onSubmit = e => {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }

    const apiToken = this.state.form.toJS();
    const result$ = saveApiToken(apiToken);
    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: t('in-settings:tabs.saving')
    });
    this.responseSubscription = result$.once(() => goToPath(teamSettingsAccessControlApiTokens));

    this.errorSubscription = result$.errors().once(error => {
      const message = t('in-settings:tabs.failedToSaveApiToken', { err: error.message });
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  };
}

function createForm(apiToken) {
  let form = createMapForm()
    // Deprecated: Fallback can be safely removed after release-195. Also see backend type ApiToken.
    .put('accessGrantingToken', createField({ value: apiToken.accessGrantingToken || apiToken.id }))
    .put(
      'name',
      createField({
        value: apiToken.name,
        validator: notBlankValidator
      })
    );

  // Deprecated: Fallback can be safely removed after release-195. Also see backend type ApiToken.
  if (apiToken.internalId) {
    form = form.put('internalId', createField({ value: apiToken.internalId }));
  } else {
    form = form.put('id', createField({ value: apiToken.id }));
  }

  return addPermissionFields(form, apiToken, apiTokenPermissions, permission => permission.keyForApiTokenApi);
}
