import {createMapForm, createField, notBlankValidator} from 'formalistic';
import {createLogger} from 'instalog';
import {Map} from 'immutable';
import React from 'react';

import ApiTokenForm from 'in-views/configurationView/subview/ApiTokens/ApiTokenForm';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {getApiToken, saveApiToken} from 'in-services/groundskeeper/apiTokens';
import Section from 'in-views/configurationView/components/Section';
import {openApiTokens} from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
import Button from 'in-components/Button';

const logger = createLogger('apiTokenConfig');

export default React.createClass({
  displayName: 'ApiToken',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: null,
      apiToken: null,
      form: null
    };
  },

  componentWillMount() {
    this.loadApiToken(this.props.params.apiTokenId);
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.params.apiTokenId !== nextProps.params.apiTokenId) {
      this.loadApiToken(nextProps.params.apiTokenId);
    }
  },

  loadApiToken(apiTokenId) {
    this.disposeAsyncAction();

    this.setState({
      loading: true,
      error: false,
      message: 'Loading API token…',
      form: null,
      apiToken: null
    });

    const result$ = getApiToken(apiTokenId);
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
  },

  componentWillUnmount() {
    this.disposeAsyncAction();
  },

  disposeAsyncAction() {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  },

  render() {
    const {apiToken, form} = this.state;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {apiToken ? `API Token: ${apiToken.get('name')}` : 'API Token'}
        </SubViewHeader>

        <form onSubmit={this.onSubmit}>
          <Section>
            {form ?
              <Button kind='success'
                      type='submit'
                      disabled={!form.hierarchyValid && form.touched}>
                Save
              </Button>
            : null}

            {this.state.message ?
              <Notification failure={this.state.error}
                            loading={this.state.loading}>
                {this.state.message}
              </Notification>
            : null}
          </Section>

          {form ?
            <ApiTokenForm form={form}
                          onChange={this.onChange} />
          : null}
        </form>

      </SubViewWrapper>
    );
  },

  onChange(fieldName, value) {
    const updatedForm = this.state.form.updateIn([fieldName], field =>
      field.setValue(value).setTouched(true)
    );

    this.setState({
      form: updatedForm
    });
  },

  onSubmit(e) {
    e.preventDefault();

    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, {recurse: true})
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
    this.responseSubscription = result$.once(openApiTokens);

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save API token: ${error.message}`;
      logger.error(message, error);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  }
});


function createForm(apiToken) {
  return createMapForm()
    .put('id', createField({value: apiToken.get('id')}))
    .put('name', createField({
      value: apiToken.get('name'),
      validator: notBlankValidator
    }))
    .put('canConfigureServiceMapping', createField({value: apiToken.get('canConfigureServiceMapping')}))
    .put('canConfigureEumApplications', createField({value: apiToken.get('canConfigureEumApplications')}))
    .put('canConfigureUsers', createField({value: apiToken.get('canConfigureUsers')}))
    .put('canInstallNewAgents', createField({value: apiToken.get('canInstallNewAgents')}))
    .put('canSeeUsageInformation', createField({value: apiToken.get('canSeeUsageInformation')}))
    .put('canConfigureIntegrations', createField({value: apiToken.get('canConfigureIntegrations')}))
    .put('canSeeOnPremLicenseInformation', createField({value: apiToken.get('canSeeOnPremLicenseInformation')}))
    .put('canConfigureRoles', createField({value: apiToken.get('canConfigureRoles')}))
    .put('canConfigureCustomAlerts', createField({value: apiToken.get('canConfigureCustomAlerts')}))
    .put('canConfigureApiTokens', createField({value: apiToken.get('canConfigureApiTokens')}));
}
