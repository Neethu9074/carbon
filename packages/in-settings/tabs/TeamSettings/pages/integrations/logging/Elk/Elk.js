/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable import/no-deprecated */

import { createMapForm, createField } from 'formalistic';
import React, { Fragment } from 'react';

import { Typography } from '@instana/components';
import { createLogger } from '@instana/logger';

import IntegrationsBreadcumb from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Integrations/IntegrationsBreadcrumb';
import { callToastFlyout } from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Integrations/utils';
import ElkForm from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Elk/ElkForm';
import { teamSettingsIntegrationsLoggingElk } from 'in-settings/navigation/paths';
import { refresh } from 'in-integrations/logging/configurationsStore';
import { integrationKey } from 'in-integrations/logging/elk/consts';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import { get, save } from 'in-integrations/logging/api';
import { isBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './ElkForm.mless';

const block = 'in-ui-config';

const logger = createLogger('elkConfig');

export default class Elk extends React.Component {
  static displayName = 'ELK';

  state = {
    loading: true,
    error: false,
    message: t('in-settings:tabs.loading'),
    integration: null,
    form: null
  };

  componentDidMount() {
    this.loadConfiguration();
  }

  loadConfiguration = id => {
    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: t('in-settings:tabs.loading'),
      id: id,
      form: null,
      integration: null
    });

    const result$ = get();

    this.responseSubscription = result$.once(integrations => {
      const integration = integrations.find(i => i.type === integrationKey);
      this.setState({
        loading: false,
        error: false,
        message: null,
        integration,
        form: createForm(integration)
      });
    });

    this.errorSubscription = result$.errors().once(() => {
      this.setState({
        loading: false,
        error: true,
        message: t('in-settings:tabs.failedToLoadElkConfiguration')
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
    const { form, message, loading } = this.state;
    const enabled = form ? form.get('enabled').value : null;

    return (
      <section className={locals.page}>
        <Title title={t('in-settings:tabs.configureElk')} />
        <IntegrationsBreadcumb />
        <SubViewHeader>{t('in-settings:tabs.configureYourElkSettings')}</SubViewHeader>
        {form && (
          <form onSubmit={this.onSubmit}>
            <Fragment>
              <div style={{ marginBottom: '1rem' }}>
                <Heading text={t('in-settings:tabs.showElkLinkOnHostsContainersAndPods')} htmlFor="elk-enabled" />
              </div>
              <SectionLine />
            </Fragment>

            <ElkForm form={form} onChange={this.onChange} areFieldsBlank={areFieldsBlank(form)} disabled={!enabled} />

            <SaveCancel
              form={form}
              message={message}
              loading={loading}
              hasCancelButton={false}
              saveEnabled={!areFieldsBlank(form)}
              type="integration"
            />
          </form>
        )}
      </section>
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

    const result$ = save(this.state.form.toJS());
    this.disposeAsyncAction();
    this.setState({
      loading: true,
      error: false,
      message: t('in-settings:tabs.saving')
    });

    this.responseSubscription = result$.once(() => {
      refresh();
      this.setState({
        loading: false
      });
      const content = (
        <section>
          <Typography variant="heading-200">{t('in-settings:tabs.integrations.toastSuccessTitle')}</Typography>
          <Typography variant="body-regular">
            {t('in-settings:tabs.integrations.toastSuccessMessage', { integrationType: 'ELK' })}
          </Typography>
        </section>
      );
      callToastFlyout('success', content);
      goToPath(teamSettingsIntegrationsLoggingElk);
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save configuration: ${error.message}`;
      logger.error(message, error);
      const content = (
        <section>
          <Typography variant="heading-200">{t('in-settings:tabs.integrations.toastErrorTitle')}</Typography>
          <Typography variant="body-regular">
            {t('in-settings:tabs.integrations.integerationConfigurationFailed', { error: message })}
          </Typography>
        </section>
      );
      callToastFlyout('error', content);
      this.setState({
        loading: false,
        error: true,
        message
      });
    });
  };
}

function createForm(integration) {
  return createMapForm()
    .put(
      'type',
      createField({
        value: integrationKey
      })
    )
    .put(
      'url',
      createField({
        value: integration ? integration['url'] : ''
      })
    )
    .put(
      'basePath',
      createField({
        value: integration ? integration['basePath'] : ''
      })
    )
    .put(
      'dashboard',
      createField({
        value: integration ? integration['dashboard'] : ''
      })
    )
    .put(
      'enabled',
      createField({
        value: integration ? integration['enabled'] : true
      })
    );
}

function Heading({ text, htmlFor }) {
  return (
    <Label className={`${block}__label`} htmlFor={htmlFor}>
      {text}
    </Label>
  );
}

function areFieldsBlank(form) {
  return isBlank(form.get('url').value) || isBlank(form.get('dashboard').value) || isBlank(form.get('basePath').value);
}
