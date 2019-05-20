import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { createLogger } from 'instalog';
import { Map } from 'immutable';
import React from 'react';

import ApiTokenForm from 'in-settings/tabs/TeamSettings/pages/accessControl/ApiTokens/ApiTokenForm';
import { teamSettingsAccessControlApiTokens } from 'in-settings/navigation/paths';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { getApiToken, saveApiToken } from 'in-api/apiTokens';
import Notification from 'in-components/form/Notification';
import SaveCancel from 'in-settings/components/SaveCancel';
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

  componentWillMount() {
    this.loadApiToken(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      this.loadApiToken(nextProps.match.params.id);
    }
  }

  loadApiToken = id => {
    this.disposeAsyncAction();

    this.setState({
      loading: true,
      error: false,
      message: 'Loading API token…',
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
        message: 'Failed to load API token.'
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
        <Title title="Api Token" />

        <SubViewHeader>{apiToken ? `API Token: ${apiToken.get('name')}` : 'API Token'}</SubViewHeader>

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

    const apiToken = Map(this.state.form.toJS());
    const result$ = saveApiToken(apiToken);
    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: 'Saving…'
    });
    this.responseSubscription = result$.once(() => goToPath(teamSettingsAccessControlApiTokens));

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save API token: ${error.message}`;
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
  return createMapForm()
    .put('id', createField({ value: apiToken.get('id') }))
    .put(
      'name',
      createField({
        value: apiToken.get('name'),
        validator: notBlankValidator
      })
    )
    .put('canConfigureServiceMapping', createField({ value: apiToken.get('canConfigureServiceMapping') }))
    .put('canConfigureEumApplications', createField({ value: apiToken.get('canConfigureEumApplications') }))
    .put('canConfigureUsers', createField({ value: apiToken.get('canConfigureUsers') }))
    .put('canInstallNewAgents', createField({ value: apiToken.get('canInstallNewAgents') }))
    .put('canSeeUsageInformation', createField({ value: apiToken.get('canSeeUsageInformation') }))
    .put('canConfigureIntegrations', createField({ value: apiToken.get('canConfigureIntegrations') }))
    .put('canSeeOnPremLicenseInformation', createField({ value: apiToken.get('canSeeOnPremLicenseInformation') }))
    .put('canConfigureRoles', createField({ value: apiToken.get('canConfigureRoles') }))
    .put('canConfigureTeams', createField({ value: apiToken.get('canConfigureTeams') }))
    .put('canConfigureCustomAlerts', createField({ value: apiToken.get('canConfigureCustomAlerts') }))
    .put('canConfigureApiTokens', createField({ value: apiToken.get('canConfigureApiTokens') }))
    .put('canConfigureAgentRunMode', createField({ value: apiToken.get('canConfigureAgentRunMode') }))
    .put('canViewAuditLog', createField({ value: apiToken.get('canViewAuditLog') }))
    .put('canConfigureAgents', createField({ value: apiToken.get('canConfigureAgents') }))
    .put('canConfigureApplications', createField({ value: apiToken.get('canConfigureApplications') }));
}
