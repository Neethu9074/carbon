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
import HumioForm from 'in-settings/tabs/TeamSettings/pages/integrations/logging/Humio/HumioForm';
import { teamSettingsIntegrationsLoggingHumio } from 'in-settings/navigation/paths';
import { integrationKey } from 'in-integrations/logging/humio/consts';
import { refresh } from 'in-integrations/logging/configurationsStore';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import { get, save } from 'in-integrations/logging/api';
import { isBlank } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './HumioForm.mless';

const block = 'in-ui-config';

const logger = createLogger('humioConfig');

export default class Humio extends React.Component {
  static displayName = 'Humio';

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
        message: t('in-settings:tabs.failedToLoadHumioConfiguration')
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
        <Title title={t('in-settings:tabs.configureHumio')} />
        <IntegrationsBreadcumb />
        <SubViewHeader>{t('in-settings:tabs.configureYourHumioSettings')}</SubViewHeader>
        {form && (
          <form onSubmit={this.onSubmit}>
            <Fragment>
              <div style={{ marginBottom: '1rem' }}>
                  <Heading text={t('in-settings:tabs.showHumioLinkOnHostsContainersAndPods')} htmlFor="humio-enabled" />
              </div>
              <SectionLine />
            </Fragment>

            <HumioForm form={form} onChange={this.onChange} areFieldsBlank={areFieldsBlank(form)} disabled={!enabled} />

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
            {t('in-settings:tabs.integrations.toastSuccessMessage', { integrationType: 'Humio' })}
          </Typography>
        </section>
      );
      callToastFlyout('success', content);
      goToPath(teamSettingsIntegrationsLoggingHumio);
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = t('in-settings:tabs.failedToSaveConfiguration', { err: error.message });
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
      'repository',
      createField({
        value: integration ? integration['repository'] : ''
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
  return isBlank(form.get('url').value) || isBlank(form.get('repository').value);
}
